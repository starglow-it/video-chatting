import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CommonGoogleInfoDto {
    @Expose()
    @ApiProperty({
        type: String
    })
    googleClientId: string;

    @Expose()
    @ApiProperty({
        type: String
    })
    googleSecret: string;


    @Expose()
    @ApiProperty({
        type: String,
        example: 'http://example.com/google-redirect'
    })
    callbackUrl: string;
}