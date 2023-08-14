import { sendRequest } from 'src/helpers/http/sendRequest';
import { deleteDraftUsersUrl } from 'src/utils/urls';

export const handleDeleteDraftUsers = async () => {
    await sendRequest<void, void>({
        ...deleteDraftUsersUrl,
    });
};
