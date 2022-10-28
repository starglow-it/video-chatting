import {
    EditTemplatePayload,
    EditUserTemplatePayload,
    GetEditingTemplateResponse,
    UploadTemplateFileResponse,
} from '../../store/templates/types';
import { Template, UserTemplate } from '../../store/types';

export type TemplateManagementProps = {
    template: Template | UserTemplate | null;
    onCancel: () => void;
    onSubmit: (data: EditUserTemplatePayload['data'] | EditTemplatePayload['data']) => void;
    onUploadFile: (file: File) => Promise<GetEditingTemplateResponse | UploadTemplateFileResponse> | undefined;
    onUpgradePlan: (data: EditUserTemplatePayload['data'] | EditTemplatePayload['data']) => void;
    isFileUploading: boolean;
};
