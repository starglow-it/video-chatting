import { ErrorState } from 'shared-types';
import { profileApiMethods } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { deleteAuthCookies } from '../../../helpers/http/destroyCookies';

export const handleDeleteProfile = async (): Promise<void> => {
    const deleteProfileUrl = profileApiMethods.deleteProfileUrl();

    await sendRequestWithCredentials<void, ErrorState>(deleteProfileUrl);

    deleteAuthCookies(undefined);
};
