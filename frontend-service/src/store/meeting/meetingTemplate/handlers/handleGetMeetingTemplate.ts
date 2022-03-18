import {ErrorState, Template} from "../../../types";
import {sendRequest} from "../../../../helpers/http/sendRequest";
import {userTemplatesUrl} from "../../../../utils/urls";
import {initialTemplateState} from "../model";

export const handleGetMeetingTemplate = async ({ templateId }: { templateId: Template['id'] }): Promise<Template> => {
    const response = await sendRequest<Template, ErrorState>(userTemplatesUrl({ templateId }));

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
}