import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetMeetingDetailParams {
    @ApiProperty({
        type: String,
        required: true
    })
    @IsNotEmpty({
        message: 'TemplateId must be present'
    })
    @IsString({
        message: 'TemplateId must be a String'
    })
    templateId: string;   
}