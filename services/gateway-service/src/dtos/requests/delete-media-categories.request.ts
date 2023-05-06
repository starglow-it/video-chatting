import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class DeleteMediaCategoriesRequest {
    @ApiProperty({
        type: [String],
        description: 'This is a list media category Ids'
    })
    @IsArray()
    ids: string[];
}