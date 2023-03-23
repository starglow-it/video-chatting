import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyGoogleAuthRequest {
    @IsNotEmpty({
        message: 'Token must be present'
    })
    @IsString({
        message: 'Token must be a string'
    })
    @ApiProperty()
    token: string;
}