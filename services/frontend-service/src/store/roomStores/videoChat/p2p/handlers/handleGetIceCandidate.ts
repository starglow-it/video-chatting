import { GetIceCandidatePayload } from '../../types';

export const handleGetIceCandidate = async ({
    connection,
    candidate,
}: GetIceCandidatePayload) => {
    if (!connection || !candidate) {
        return;
    }
    await connection.addIceCandidate(candidate);
};
