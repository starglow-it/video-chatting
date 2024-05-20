import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
