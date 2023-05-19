import { deleteMediaUrl } from 'src/const/urls/backgrounds';
import { DeleteMediaParams, ResultActionBackground } from '../types';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { ErrorState } from 'shared-types';

export const handleDeleteMedia = async ({
    categoryId = '',
    ids = [],
}: DeleteMediaParams): Promise<ResultActionBackground> => {
    const { success } = await sendRequestWithCredentials<void, ErrorState>({
        ...deleteMediaUrl({ categoryId }),
        data: { ids },
    });

    return {
        success: success,
        message: success
            ? 'backgrounds.deleteMediaSuccess'
            : 'backgrounds.deleteMediaFail',
    };
};
