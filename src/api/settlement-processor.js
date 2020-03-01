const { round, sortBy } = require('lodash');
const moment = require('moment');
const Queue = require('bull');

class SettlementProcessor {
  constructor(redisUrl, maxRetryCount = 100, applicationFeeAmount = 15) {
    this._queue = new Queue('SettlementProcessor', redisUrl);
    this._maxRetryCount = maxRetryCount;
    this._applicationFeeAmount = round(applicationFeeAmount / 100, 2);

    this._queue
      .on('drained', () => console.warn('queue drained'))
      .on('error', (err) => console.error('queue error:', err))
      .on('stalled', (job) => console.warn('job stalled; id:', job.id))
      .on('completed', (job) => console.warn('job completed; id:', job.id))
      .on('failed', (job, err) => console.error('job', job.id, err));

    this._handleTick = this._handleTick.bind(this);
    this._handleProcess = this._handleProcess.bind(this);
  }

  startWithContext(context) {
    if (this._timeout) {
      throw new Error('SettlementProcessor is already running');
    }

    this._context = context;
    this._timeout = setTimeout(this._handleTick, 1000);
    this._queue.process(this._handleProcess);
    this._queue.resume(true);
  }

  async end() {
    if (!this._timeout) {
      throw new Error('SettlementProcessor is not running');
    }

    clearTimeout(this._timeout);

    await this._queue.pause(true);
    await this._queue.close(true);

    this._timeout = null;
    this._context = null;
  }

  async _queryAndAddTasks() {
    const { db } = this._context;

    const gracePeriod = moment()
      .subtract(20, 'seconds')
      .toDate();

    const query = await db
      .collection('auctions')
      .where('endsAt', '<', gracePeriod)
      .where('isSettled', '==', false)
      .select()
      .get();

    for (const doc of query.docs) {
      const data = {
        id: doc.id
      };

      const options = {
        jobId: 'auc-' + doc.id,
        attempts: this._maxRetryCount
      };

      await this._queue.add(data, options);
    }
  }

  async _handleTick() {
    try {
      await this._queryAndAddTasks();
    } catch (err) {
      console.warn('SettlementProcessor tick error:', err);
    }

    this._timeout = setTimeout(this._handleTick, 1000);
  }

  async _settleBid(stripeAccountId, bid) {
    console.info('settling bid:', bid.id);

    const { db, stripe } = this._context;

    const user = await db
      .collection('users')
      .doc(bid.createdBy)
      .get()
      .then((doc) => doc.data());

    if (!user.stripeCustomerId) {
      throw new Error('user ' + bid.createdBy + ' does not have billing setup');
    }

    const ref = db.collection('bids').doc(bid.id);
    const chargeAmount = bid.amount * 100;
    const chargeApplicationFeeAmount =
      chargeAmount * this._applicationFeeAmount;

    await db.runTransaction(async (tx) => {
      await tx.update(ref, { isWinner: true });

      const charge = await stripe.charges.create({
        currency: 'usd',
        description: 'Charged for bid id: ' + bid.id,
        amount: chargeAmount,
        application_fee_amount: chargeApplicationFeeAmount,
        customer: user.stripeCustomerId,
        source: bid.paymentMethodId,
        metadata: {
          bidId: bid.id,
          paymentMethodId: bid.paymentMethodId
        },
        on_behalf_of: stripeAccountId,
        transfer_data: {
          destination: stripeAccountId
        }
      });

      tx.update(ref, { chargeId: charge.id });
    });
  }

  async _handleProcess(job) {
    const auctionId = job.data.id;
    const { db } = this._context;

    console.info('settling auction: ', auctionId);

    const auction = await db
      .collection('auctions')
      .doc(auctionId)
      .get()
      .then((doc) => doc.data());

    const user = await db
      .collection('users')
      .doc(auction.createdBy)
      .get()
      .then((doc) => doc.data());

    const rawBids = await db
      .collection('bids')
      .where('auctionId', '==', auctionId)
      .select('id', 'amount', 'createdBy', 'isWinner', 'paymentMethodId')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snap) => snap.docs)
      .then((docs) => docs.map((doc) => doc.data()));

    const { winnerCount, type, amount = 1000000 } = auction;

    const bids =
      type === 'HIGHEST_BID_WINS'
        ? rawBids
        : sortBy(rawBids, (bid) => Math.abs(amount - bid.amount));

    const winners = bids
      .filter((bid) => bid.isWinner)
      .map((bid) => bid.createdBy);

    if (winners.length) {
      console.info('Loaded winners:', winners);
    }

    for (let it = 0; it < bids.length && winners.length < winnerCount; it++) {
      const bid = bids[it];

      if (!winners.includes(bid.createdBy)) {
        try {
          await this._settleBid(user.stripeAccountId, bid);
          winners.push(bid.createdBy);
        } catch (err) {
          console.warn('Charge for', bid.amount, 'USD failed:', err.message);

          await db
            .collection('bids')
            .doc(bid.id)
            .update({ chargeError: err.message || err })
            .catch(console.warn);
        }
      }
    }

    await db
      .collection('auctions')
      .doc(auctionId)
      .update({ isSettled: true });
  }
}

module.exports = SettlementProcessor;
