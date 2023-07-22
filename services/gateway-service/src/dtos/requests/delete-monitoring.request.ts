import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class DeleteMonitoringRequestDto {
    @ApiProperty({
        type: Date,
        description: 'This is the timestamp when the object is updated'
    })
    @IsString()
    @Transform(({value}) => new Date(value))
    from: Date;
}