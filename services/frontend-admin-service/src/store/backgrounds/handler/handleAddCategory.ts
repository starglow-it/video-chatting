import { ErrorState, IMediaCategory } from 'shared-types';
import { addCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory } from '../types';

export const handleAddCategory = async (
    category: IMediaCategory,
): Promise<IBackgroundCategory | null> => {
    const response = await sendRequestWithCredentials<
        { id: string },
        ErrorState
    >({ ...addCategoryUrl, data: category });

    if (response.success && response.result) {
        return { ...category, id: response.result };
    }
    return null;
};
