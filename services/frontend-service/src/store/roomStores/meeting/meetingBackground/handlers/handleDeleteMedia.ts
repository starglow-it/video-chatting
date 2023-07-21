import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { deleteMediaCategory } from 'src/utils/urls';
import { ParamsDeleteMedia, ResultDeleteMedia } from '../types';

export const handleDeleteMediaMeeting = async ({
    categoryId,
    deleteId,
    userTemplateId,
}: ParamsDeleteMedia): Promise<ResultDeleteMedia> => {
    const { result, success } = await sendRequestWithCredentials<boolean, void>(
        {
            ...deleteMediaCategory({ categoryId, userTemplateId }),
            data: {
                ids: [deleteId],
            },
        },
    );

    if (success && result) {
        return { success, message: 'meeting.deleteBackgroundSuccess' };
    }

    return { success, message: 'meeting.deleteBackgroundError' };
};
