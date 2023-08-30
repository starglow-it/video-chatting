import { EntityList, IMeetingAvatar } from 'shared-types';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { getAvatarsMeetingUrl } from 'src/utils/urls';

export const handleGetAvatars = async (): Promise<
    EntityList<IMeetingAvatar>
> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<IMeetingAvatar>,
        void
    >({
        ...getAvatarsMeetingUrl,
    });

    if (success && result) {
        return { ...result };
    }
    if (!success) {
        return { list: [], count: 0 };
    }
    return { list: [], count: 0 };
};
