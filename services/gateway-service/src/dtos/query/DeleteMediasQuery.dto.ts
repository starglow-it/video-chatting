import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteMediasQueryDto {
    @ApiProperty({
        type: String,
        required: true
    })
    @IsNotEmpty({
        message: 'CategoryId must be present'
    })
    @IsString({
        message: 'CategoryId must be a String'
    })
    categoryId: string;   

    @ApiProperty({
        type: String
    })
    @IsNotEmpty({
        message: 'userTemplateId must be present'
    })
    @IsString({
        message: 'userTemplateId must be a String'
    })
    userTemplateId: string;
}