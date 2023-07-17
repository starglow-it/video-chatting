import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { IBusinessCategory } from "shared-types";

export class CreateBusinessCategoryRequest {
    @ApiProperty({
        type: String,
        example: 'yamatekudasai',
        description: 'Key is lower case charators'
    })
    @IsNotEmpty({
        message: 'Key must be present'
    })
    @IsString({
        message: 'Invalid Key value'
    })
    @Matches(/^[a-z0-9\W]+$/, {
        message: 'Invalid Key format'
    })
    key: IBusinessCategory['key'];

    @ApiProperty({
        type: String,
        example: 'Yamate Kudasai'
    })
    @IsNotEmpty({
        message: 'Value must be present',
    })
    @IsString({
        message: 'Invalid Value value',
    })
    value: IBusinessCategory['value'];

    @ApiProperty({
        type: String,
        example: '1f23a'
    })
    @IsNotEmpty({
        message: 'Value must be present',
    })
    @IsString({
        message: 'Invalid Value value',
    })
    color: IBusinessCategory['color'];

    @ApiProperty({
        type: String,
        example: '1f23a'
    })
    @IsNotEmpty({
        message: 'Icon must be present',
    })
    @IsString({
        message: 'Invalid Icon value',
    })
    icon: IBusinessCategory['icon'];
}