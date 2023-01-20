import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdParam {
  @IsNotEmpty({
    message: 'userId must be present',
  })
  @IsMongoId({ message: 'userId must be valid BSON id ' })
  @ApiProperty()
  readonly userId: string;
}
