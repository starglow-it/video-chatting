import {DeleteCommonTemplateSoundPayload, ErrorState, ICommonTemplate} from "shared-types";

import {CommonTemplateState} from "../../types";
import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {deleteCommonTemplateSoundUrl} from "../../../const/urls/templates";

export const handleDeleteCommonTemplateSound = async (params: DeleteCommonTemplateSoundPayload): Promise<CommonTemplateState> => {
    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >(deleteCommonTemplateSoundUrl(params));

    if (response.success) {
        return {
            state: response.result!,
            error: null,
        };
    }

    return {
        state: undefined,
        error: response.error,
    };
}