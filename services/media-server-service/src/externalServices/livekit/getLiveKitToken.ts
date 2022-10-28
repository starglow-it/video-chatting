import { AccessToken } from 'livekit-server-sdk';
import { getConfigVar } from '../../services/config';

export const getLiveKitToken = async ({
    templateId,
    userId,
}: {
    templateId: string;
    userId: string;
}) => {
    try {
        const apiKey = await getConfigVar('livekitApiKey');
        const apiSecret = await getConfigVar('livekitApiSecret');

        const at = new AccessToken(apiKey, apiSecret, {
            identity: userId,
        });

        at.addGrant({ roomJoin: true, room: templateId });

        return at.toJwt();
    } catch (e) {
        console.log(e);
        return '';
    }
};
