import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto {
  @Expose()
  @ApiProperty()
  readonly success: boolean;

  @Expose()
  @ApiProperty()
  readonly error?: boolean;

  @Expose()
  @ApiProperty()
  readonly message?: string;

  @Expose()
  @ApiProperty()
  readonly result?: unknown;
}
