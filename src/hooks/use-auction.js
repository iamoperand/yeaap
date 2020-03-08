import { useContext } from 'react';
import { isUndefined } from 'lodash';

import AuctionContext from '../context/auction-context';

const useAuction = () => {
  const context = useContext(AuctionContext);
  if (isUndefined(context)) {
    throw new Error('useAuction must be used within AuctionContext');
  }

  return context;
};

export default useAuction;
