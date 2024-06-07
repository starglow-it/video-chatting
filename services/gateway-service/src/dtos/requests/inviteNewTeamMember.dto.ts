import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SeatTypes } from 'shared-types';

export class InviteNewTeamMemberDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  hostEmail: string;

  @IsEmail() 
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  userEmail: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  seat: SeatTypes;
}
