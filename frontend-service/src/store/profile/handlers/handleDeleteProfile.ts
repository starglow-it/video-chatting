import { ErrorState } from '../../types';
import { deleteProfileUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { deleteAuthCookies } from '../../../helpers/http/destroyCookies';

export const handleDeleteProfile = async (): Promise<void> => {
    await sendRequestWithCredentials<void, ErrorState>(deleteProfileUrl);

    deleteAuthCookies(undefined);

    return;
};
