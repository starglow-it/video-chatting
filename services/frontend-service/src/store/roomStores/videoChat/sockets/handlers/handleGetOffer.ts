import { getOfferFxWithStore } from '../../p2p/init';
import { OfferExchangePayload } from '../../types';

export const handleGetOffer = async (data: OfferExchangePayload) => {
    await getOfferFxWithStore(data);
};
