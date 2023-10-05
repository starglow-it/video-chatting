import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MeetingRole, Timestamp } from 'shared-types';
import { IsTimestamp } from '../../utils/decorators/validators/isTimestamp';
import { ApiProperty } from '@nestjs/swagger';

class TimestampRequestDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  month: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  day: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  hours: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  minutes: number;
}

export class ScheduleRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  templateId: string;

  @ApiProperty({
    type: TimestampRequestDto,
  })
  @IsNotEmpty()
  @IsTimestamp()
  startAt: Timestamp;

  @ApiProperty({
    type: TimestampRequestDto,
  })
  @IsNotEmpty()
  @IsTimestamp()
  endAt: Timestamp;

  @ApiProperty({
    type: String
  })
  @IsNotEmpty()
  @IsString()
  timeZone: string;

  @ApiProperty({
    type: String
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({
    type: String,
    example: 'participant'
  })
  @IsNotEmpty()
  @IsString()
  role: MeetingRole.Participant | MeetingRole.Lurker;

  @ApiProperty({
    type: [String],
  })
  @IsNotEmpty()
  @IsString({
    each: true
  })
  userEmails: string[];
}
