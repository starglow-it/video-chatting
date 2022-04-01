import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";

import {ErrorState, UserTemplate} from "../../types";
import { deleteProfileTemplatesUrl } from "../../../utils/urls";

export const handleDeleteProfileTemplate = async ({ templateId }: { templateId: UserTemplate["id"]; }): Promise<void> => {
    const response = await sendRequestWithCredentials<void, ErrorState>(deleteProfileTemplatesUrl({ templateId }));

    if (response.success) {
        return response.result;
    }

    return;
}