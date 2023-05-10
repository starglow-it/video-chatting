import { ErrorState } from 'shared-types';
import { deleteCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { ResultDeleteCategory } from '../types';

export const handleDeleteCategory = async ({
    ids,
}: {
    ids: string[];
}): Promise<ResultDeleteCategory> => {
    const { success } = await sendRequestWithCredentials<void, ErrorState>({
        ...deleteCategoryUrl,
        data: { ids },
    });

    return {
        success,
        ids,
        message: success
            ? 'backgrounds.deleteCategorySuccess'
            : 'backgrounds.deleteCategoryFail',
    };
};
