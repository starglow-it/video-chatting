import { ErrorState, IMediaCategory } from 'shared-types';
import { addCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory } from '../types';

export const handleAddCategory = async (
    category: IMediaCategory,
): Promise<IBackgroundCategory | null> => {
    const response = await sendRequestWithCredentials<
        IBackgroundCategory,
        ErrorState
    >({ ...addCategoryUrl, data: category });

    if (response.success && response.result) {
        return response.result;
    }
    return null;
};
