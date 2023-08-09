import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetMeetingDetailQuery {
    @ApiProperty({
      type: String,
      required: false,
    })
    @IsOptional()
    @IsString()
    public subdomain: string;
  }