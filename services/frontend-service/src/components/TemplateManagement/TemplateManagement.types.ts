import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { ICommonTemplate, IUserTemplate } from 'shared-types';
import {
    GetEditingTemplateResponse,
    UploadTemplateFileResponse,
} from '../../store/templates/types';

export type TemplateManagementProps = {
    template: ICommonTemplate | IUserTemplate | null;
    onCancel: () => void;
    onSubmit: (data: IUploadTemplateFormData) => void;
    onSubmitAndEnterMeeting: (data: IUploadTemplateFormData) => void;
    onSubmitAndScheduleMeeting: (data: IUploadTemplateFormData) => void;
    onUploadFile: (
        file: File,
    ) =>
        | Promise<GetEditingTemplateResponse | UploadTemplateFileResponse>
        | undefined;
    onUpgradePlan: () => void;
    isFileUploading: boolean;
};
