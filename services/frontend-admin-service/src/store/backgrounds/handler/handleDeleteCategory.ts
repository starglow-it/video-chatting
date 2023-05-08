import { ErrorState } from 'shared-types';
import { deleteCategoryUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';

export const handleDeleteCategory = async ({
    ids,
}: {
    ids: string[];
}): Promise<string[]> => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...deleteCategoryUrl,
        data: { ids },
    });

    return ids;
};
