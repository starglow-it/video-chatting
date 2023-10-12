import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IUserPosition } from 'src/interfaces/common-user.interface';

export class UserPositionDto implements IUserPosition {
  @IsNotEmpty()
  @IsNumber()
  bottom: number;

  @IsNotEmpty()
  @IsNumber()
  left: number;
}
