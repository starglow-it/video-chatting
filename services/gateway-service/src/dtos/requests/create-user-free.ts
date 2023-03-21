import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserFreeRequest {
    @ApiProperty({
        type: String,
        description: 'This field must be UUID v3 type'
    })
    @IsNotEmpty({
        message: 'Uuid must be present'
    })
    @IsUUID(3, {
        message: 'This field must be UUID v3 type'
    })
    readonly uuid: string;
}