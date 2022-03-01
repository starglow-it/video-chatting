import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AgoraTokenRestDTO {
  @Expose()
  @ApiProperty()
  token: string;
}
