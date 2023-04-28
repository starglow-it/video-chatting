import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IUserTemplate } from "shared-types";

export class CreateUserTemplateMediaRequest {

    @ApiProperty({
        type: String
    })
    @IsNotEmpty({
        message: 'userTemplateId must be present',
    })
    @IsString({
        message: 'Invalid userTemplateId value',
    })
    userTemplateId: IUserTemplate['id'];
}