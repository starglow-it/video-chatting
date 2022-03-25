import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { UpdateProfileInfo, Profile, ErrorState } from '../../types';
import { postProfileUrl } from "../../../utils/urls";

export const handleUpdateProfileInfo = async (
    params: UpdateProfileInfo,
): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...postProfileUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.result;
    }
};
