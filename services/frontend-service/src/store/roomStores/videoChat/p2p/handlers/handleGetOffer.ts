import { GetOfferPayload } from '../../types';

export const handleGetOffer = async ({ connection, sdp }: GetOfferPayload) => {
    if (!sdp) {
        return;
    }

    await connection?.processOffer(sdp);
};
