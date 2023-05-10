import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteMediasParam {
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
}