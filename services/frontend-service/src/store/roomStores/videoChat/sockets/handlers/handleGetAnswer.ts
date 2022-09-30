import { getAnswerFxWithStore } from '../../p2p/init';
import { AnswerExchangePayload } from '../../types';

export const handleGetAnswer = async (data: AnswerExchangePayload) => {
    await getAnswerFxWithStore(data);
};
