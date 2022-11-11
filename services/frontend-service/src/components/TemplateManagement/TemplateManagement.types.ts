import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import {
    GetEditingTemplateResponse,
    UploadTemplateFileResponse,
} from '../../store/templates/types';
import { Template, UserTemplate } from '../../store/types';

export type TemplateManagementProps = {
    template: Template | UserTemplate | null;
    onCancel: () => void;
    onSubmit: (data: IUploadTemplateFormData) => void;
    onUploadFile: (
        file: File,
    ) => Promise<GetEditingTemplateResponse | UploadTemplateFileResponse> | undefined;
    onUpgradePlan: (data: IUploadTemplateFormData) => void;
    isFileUploading: boolean;
};
