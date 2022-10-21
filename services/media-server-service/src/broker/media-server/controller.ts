import { IBrokerHandler, IBrokerHandlerArgs } from '../../../types/broker';
import { getLiveKitToken } from '../../externalServices/livekit/getLiveKitToken';

export const consumeGetToken: IBrokerHandler = async ({
    payload,
}: IBrokerHandlerArgs) => {
    const token = await getLiveKitToken({
        templateId: payload?.data?.templateId,
        userId: payload?.data?.userId,
    });

    return {
        result: token,
    };
};
