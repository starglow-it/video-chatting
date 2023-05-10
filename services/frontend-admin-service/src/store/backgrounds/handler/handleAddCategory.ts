import { ErrorState, IMediaCategory } from 'shared-types';
import { addCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory, ResultActionBackground } from '../types';

export const handleAddCategory = async (
    category: IMediaCategory,
): Promise<ResultActionBackground> => {
    const { success, result } = await sendRequestWithCredentials<
        IBackgroundCategory,
        ErrorState
    >({ ...addCategoryUrl, data: category });

    if (success && result) {
        return {
            success: success,
            message: 'backgrounds.addCategorySuccess',
        };
    }
    return {
        success: success,
        message: 'backgrounds.addCategoryFail',
    };
};
