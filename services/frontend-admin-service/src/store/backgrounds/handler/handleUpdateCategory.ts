import { ErrorState, IMediaCategory } from 'shared-types';
import { updateCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory } from '../types';

export const handleUpdateCategory = async (
    category: IBackgroundCategory,
): Promise<IBackgroundCategory> => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...updateCategoryUrl({ categoryId: category.id }),
        data: {
            key: category.key,
            value: category.value,
            emojiUrl: category.emojiUrl,
            type: category.type,
        } as IMediaCategory,
    });
    if (response.success) {
        return category;
    }
    return category;
};
