import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaRequest {
  @IsNotEmpty({
    message: 'mediaCategoryId must be present',
  })
  @IsString({
    message: 'Invalid CategoryId value',
  })
  categoryId: string;
}
