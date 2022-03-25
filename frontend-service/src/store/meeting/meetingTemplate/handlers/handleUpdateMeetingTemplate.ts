import {ErrorState, Template, UpdateTemplateData} from "../../../types";
import {sendRequest} from "../../../../helpers/http/sendRequest";
import {postUserTemplatesUrl } from "../../../../utils/urls";
import {initialTemplateState} from "../model";

export const handleUpdateMeetingTemplate = async ({ templateId, data }: UpdateTemplateData): Promise<Template> => {
    const response = await sendRequest<Template, ErrorState>(
        {
            ...postUserTemplatesUrl({ templateId }),
            data,
        },
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
}