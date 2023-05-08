import { deleteMediaUrl } from 'src/const/urls/backgrounds';
import { DeleteMediaParams } from '../types';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { ErrorState } from 'shared-types';

export const handleDeleteMedia = async ({
    categoryId = '',
    ids = [],
}: DeleteMediaParams) => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...deleteMediaUrl({ categoryId }),
        data: { ids },
    });

    return response.success;
};
