import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId } from "class-validator";

export class DeleteBusinessCategoriesRequest {
    @ApiProperty({
        type: [String],
        description: 'This is a list business category Ids'
    })
    @IsArray()
    ids: string[];
}