import {ErrorState, Template, UpdateTemplateData} from "../../../types";
import {sendRequest} from "../../../../helpers/http/sendRequest";
import {userTemplatesUrl} from "../../../../utils/urls";
import {initialTemplateState} from "../model";

export const handleUpdateMeetingTemplate = async ({ templateId, data }: UpdateTemplateData): Promise<Template> => {
    const response = await sendRequest<Template, ErrorState>(
        {
            ...userTemplatesUrl({ templateId }),
            data,
        },
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
}