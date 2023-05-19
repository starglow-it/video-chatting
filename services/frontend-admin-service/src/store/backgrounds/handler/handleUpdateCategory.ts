import { ErrorState, IMediaCategory } from 'shared-types';
import { updateCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory, ResultUpdateCategory } from '../types';

export const handleUpdateCategory = async (
    category: IBackgroundCategory,
): Promise<ResultUpdateCategory> => {
    const { success } = await sendRequestWithCredentials<void, ErrorState>({
        ...updateCategoryUrl({ categoryId: category.id }),
        data: {
            key: category.key,
            value: category.value,
            emojiUrl: category.emojiUrl,
            type: category.type,
        } as IMediaCategory,
    });
    return {
        category,
        success,
        message: success
            ? 'backgrounds.updateCategorySuccess'
            : 'backgrounds.updateCategoryFail',
    };
};
