import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeHostDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
