import { IsNotEmpty, IsString } from "class-validator";
import { IUserTemplate } from "shared-types";

export class UpdateMeetingTemplateRequestDto {
    @IsNotEmpty()
    @IsString()
    templateId: IUserTemplate['id']
}