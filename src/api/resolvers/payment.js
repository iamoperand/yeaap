const { toUpper, pick } = require('lodash');
const moment = require('moment');

const mapSourceCard = (card) => ({
  last4: card.last4,
  brand: toUpper(card.brand),
  expires: {
    month: card.exp_month,
    year: card.exp_year
  },
  holderName: card.name
});

const mapSourceBankAccount = (bankAccount) => ({
  country: bankAccount.country,
  currency: bankAccount.currency,
  last4: bankAccount.last4,
  routingNumber: bankAccount.routing_number,
  isVerified: bankAccount.status === 'verified',
  bankName: bankAccount.bank_name,
  holderName: bankAccount.account_holder_name
});

const mapStripePaymentMethod = (paymentMethod) => {
  const { id, object } = paymentMethod;

  const source =
    object === 'card'
      ? mapSourceCard(paymentMethod)
      : object === 'bank_account'
      ? mapSourceBankAccount(paymentMethod)
      : null;

  if (!source) {
    throw new Error('unknown payment source type: ' + object);
  }

  return {
    id,
    type: toUpper(object),
    source: {
      ...source,
      type: toUpper(object)
    },
    billingAddress: {
      city: paymentMethod.address_city,
      country: paymentMethod.address_country,
      line1: paymentMethod.address_line1,
      line2: paymentMethod.address_line2,
      state: paymentMethod.address_state,
      postalCode: paymentMethod.address_zip
    }
  };
};

const mapStripeAccount = (account) => {
  const {
    id,
    business_type,
    country,
    default_currency,
    external_accounts,
    created,
    requirements
  } = account;

  return {
    id,
    country,
    isVerificationRequired: Boolean(requirements.disabled_reason),
    currency: default_currency,
    type: toUpper(business_type),
    createdAt: moment.unix(created).toDate(),
    paymentMethods: external_accounts.data.map(mapStripePaymentMethod)
  };
};

const resolveTypePaymentMethodSource = (data) => {
  const { parent } = data;

  const types = {
    CARD: 'PaymentMethodCard',
    BANK_ACCOUNT: 'PaymentMethodBankAccount'
  };

  return types[parent.type] || null;
};

const userPaymentPayoutAccount = async (data) => {
  const {
    context: { user, stripe }
  } = data;

  if (!user.stripeAccountId) {
    return null;
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  return mapStripeAccount(account);
};

const userPaymentMethods = async (data) => {
  const {
    context: { user, stripe }
  } = data;

  if (!user.stripeCustomerId) {
    return [];
  }

  const customer = await stripe.customers.retrieve(user.stripeCustomerId);

  return customer.sources.data.map(mapStripePaymentMethod);
};

const userAccountBalance = async (data) => {
  const {
    context: { user, stripe }
  } = data;

  if (!user.stripeAccountId) {
    return 0;
  }

  const accountBalance = await stripe.balance.retrieve({
    stripeAccount: user.stripeAccountId
  });

  const { pending, available } = accountBalance;
  return {
    pending: pending.map((balance) => pick(balance, ['amount', 'currency'])),
    available: available.map((balance) => pick(balance, ['amount', 'currency']))
  };
};

const attachPaymentMethod = async (data) => {
  const {
    context: { user, stripe },
    args: { data: inputData }
  } = data;

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      description: 'Customer created by an API',
      metadata: {
        userId: user.id
      }
    });

    try {
      await (user.stripeCustomerId = customer.id);
    } catch (err) {
      await stripe.customers.del(customer.id);
      throw err;
    }
  }

  const source = await stripe.customers.createSource(user.stripeCustomerId, {
    source: inputData.paymentMethodId
  });

  return mapStripePaymentMethod(source);
};

const removePaymentMethod = async (data) => {
  const {
    context: { user, stripe },
    args: { where }
  } = data;

  await stripe.customers.deleteSource(
    user.stripeCustomerId,
    where.paymentMethodId
  );

  return true;
};

const createPaymentPayoutAccount = async (data) => {
  const {
    context: { user, stripe, request },
    args: { data: inputData }
  } = data;

  const options = {
    type: 'custom',
    business_type: 'individual',
    email: user.email,
    country: inputData.country,
    requested_capabilities: ['card_payments', 'transfers'],
    metadata: {
      userId: user.id
    },
    tos_acceptance: {
      date: moment().unix(),
      ip: request.ip,
      user_agent: request.userAgent
    }
  };

  if (inputData.paymentMethodId) {
    options.external_account = inputData.paymentMethodId;
  }

  const account = await stripe.accounts.create(options);

  try {
    await (user.stripeAccountId = account.id);
  } catch (err) {
    await stripe.accounts.del(account.id);
    throw err;
  }

  return mapStripeAccount(account);
};

const attachPayoutPaymentMethod = async (data) => {
  const {
    context: { user, stripe },
    args: { data: inputData }
  } = data;

  const method = await stripe.accounts.createExternalAccount(
    user.stripeAccountId,
    {
      external_account: inputData.paymentMethodId
    }
  );

  return mapStripePaymentMethod(method);
};

const removePayoutPaymentMethod = async (data) => {
  const {
    context: { user, stripe },
    args: { where }
  } = data;

  await stripe.accounts.deleteExternalAccount(
    user.stripeAccountId,
    where.paymentMethodId
  );

  return true;
};

const createPaymentPayoutAccountOnboardingUrl = async (data) => {
  const {
    context: { user, stripe },
    args: { data: inputData }
  } = data;

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  const type = account.details_submitted
    ? 'custom_account_update'
    : 'custom_account_verification';

  const link = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    failure_url: inputData.failureRedirectUrl.href,
    success_url: inputData.successRedirectUrl.href,
    type,
    collect: 'eventually_due'
  });

  return link.url;
};

module.exports = {
  PaymentMethodSource: {
    __resolveType: resolveTypePaymentMethodSource
  },
  UserPrivate: {
    paymentPayoutAccount: userPaymentPayoutAccount,
    paymentMethods: userPaymentMethods,
    accountBalance: userAccountBalance
  },
  Mutation: {
    attachPaymentMethod,
    removePaymentMethod,
    createPaymentPayoutAccount,
    attachPayoutPaymentMethod,
    removePayoutPaymentMethod,
    createPaymentPayoutAccountOnboardingUrl
  }
};
