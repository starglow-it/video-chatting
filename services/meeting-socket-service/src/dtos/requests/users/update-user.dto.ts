import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class UpdateUserRequestDTO implements Partial<ICommonMeetingUserDTO> {
  @IsOptional()
  @IsString({
    message: 'Invalid id',
  })
  id: ICommonMeetingUserDTO['id'];

  @IsOptional()
  @IsString({
    message: 'Invalid username',
  })
  username: ICommonMeetingUserDTO['username'];

  @IsOptional()
  isAuraActive: ICommonMeetingUserDTO['isAuraActive'];

  @IsOptional()
  @IsNumber()
  userSize: number;

  @IsOptional()
  userPosition: ICommonMeetingUserDTO['userPosition'];

  @IsOptional()
  @IsBoolean()
  doNotDisturb: boolean;

  @IsOptional()
  @IsBoolean()
  isDonated: boolean;

  @IsOptional()
  @IsBoolean()
  isPaywallPaid: boolean;
}
