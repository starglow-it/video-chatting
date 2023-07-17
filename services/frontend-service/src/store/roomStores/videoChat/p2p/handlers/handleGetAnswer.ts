import { GetAnswerPayload } from '../../types';

export const handleGetAnswer = async ({
    connection,
    sdp,
}: GetAnswerPayload) => {
    if (!connection || !sdp) {
        return;
    }

    await connection.addAnswer(sdp);
};
