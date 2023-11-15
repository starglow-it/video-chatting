import { IsNotEmpty, IsNumber } from 'class-validator';
import { IUserPosition } from '../../../interfaces/common-user.interface';

export class UserPositionDto implements IUserPosition {
  @IsNotEmpty()
  @IsNumber()
  bottom: number;

  @IsNotEmpty()
  @IsNumber()
  left: number;
}
