import { getIceCandidateFxWithStore } from '../../p2p/init';
import { IceCandidatesExchangePayload } from '../../types';

export const handleGetIceCandidate = async (
    data: IceCandidatesExchangePayload,
) => {
    await getIceCandidateFxWithStore(data);
};
