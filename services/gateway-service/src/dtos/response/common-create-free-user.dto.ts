import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IUserTemplate } from "shared-types";
import { CommonUserRestDTO } from "./common-user.dto";

export class CommonCreateFreeUserDto {
    @Expose()
    @ApiProperty({
        type: CommonUserRestDTO
    })
    readonly user: Object;

    @Expose()
    @ApiProperty({
        type: String
    })
    readonly userTemplateId: IUserTemplate['id'];
}