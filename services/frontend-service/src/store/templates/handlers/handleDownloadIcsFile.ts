import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { downloadIcsFileUrl } from '../../../utils/urls';

export const handleDownloadIcsFile = async (data: {
    templateId: string;
    content: string;
}): Promise<string | undefined> => {
    const response = await sendRequestWithCredentials<
        { icsLink: string },
        ErrorState
    >({
        ...downloadIcsFileUrl,
        data,
    });

    if (response.success) {
        return response.result.icsLink;
    }
};
