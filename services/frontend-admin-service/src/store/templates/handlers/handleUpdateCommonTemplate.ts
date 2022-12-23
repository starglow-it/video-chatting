import {generateFormData} from "shared-utils";
import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState, ICommonTemplate, UpdateCommonTemplatePayload } from "shared-types";
import {updateCommonTemplateUrl} from "../../../const/urls/templates";
import {CommonTemplateState} from "../../types";

export const handleUpdateCommonTemplate = async (params: UpdateCommonTemplatePayload): Promise<CommonTemplateState> => {
    const formData = generateFormData(params.data);

    const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
        ...updateCommonTemplateUrl({
            templateId: params.templateId,
        }),
        data: formData,
    });

    if (response.success && response.result) {
        return {
            state: response.result,
            error: null,
        };
    }
    return {
        state: undefined,
        error: null,
    };
}