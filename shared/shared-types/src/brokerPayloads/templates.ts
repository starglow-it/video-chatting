import {IBusinessCategory, ICommonTemplate, ICommonUser, IUpdateTemplate, IUserTemplate} from "../api-interfaces";

export type GetCommonTemplatesPayload = {
    skip?: number; limit?: number
};

export type GetUserTemplatesPayload = {
    userId: ICommonUser["id"];
    skip: number;
    limit: number;
};

export type GetUserTemplatePayload = {
    id: IUserTemplate["id"]
};

export type GetCommonTemplatePayload = Partial<ICommonTemplate>;

export type GetUserTemplateByTemplateIdPayload = {
    id: ICommonTemplate["templateId"];
    userId: ICommonUser["id"];
};

export type GetUserTemplateByIdPayload = {
    id: IUserTemplate["id"];
};

export type UpdateUserTemplatePayload = {
    templateId: IUserTemplate["id"];
    userId: ICommonUser["id"];
    data: Partial<IUpdateTemplate>;
};

export type CreateUserTemplateByIdPayload = {
    id: ICommonTemplate["id"];
    userId: ICommonUser["id"];
};

export type GetUsersTemplatesPayload = {
    userId: ICommonUser["id"];
    skip: number;
    limit: number;
};

export type DeleteUsersTemplatesPayload = {
    templateId: IUserTemplate["id"],
    userId: ICommonUser["id"]
};

export type AddTemplateToUserPayload = {
    templateId: string;
    userId: string;
};

export type UploadTemplateFilePayload = {
    url: ICommonTemplate["url"];
    id: ICommonTemplate["id"];
    mimeType: string
};

export type CreateTemplatePayload = {
    userId: IUserTemplate["id"]
};

export type EditTemplatePayload = {
    templateId: ICommonTemplate['id'];
    data: Omit<Partial<ICommonTemplate>, 'businessCategories'> & {
        businessCategories: IBusinessCategory[];
    };
};
export type DeleteCommonTemplatePayload = { templateId: ICommonTemplate["id"] };

