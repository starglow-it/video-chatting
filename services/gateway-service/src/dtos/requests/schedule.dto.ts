import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MeetingRole, ITimestamp } from 'shared-types';
import { IsTimestamp } from '../../utils/decorators/validators/isTimestamp';
import { ApiProperty } from '@nestjs/swagger';

class TimestampRequestDto implements ITimestamp {
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
  startAt: ITimestamp;

  @ApiProperty({
    type: TimestampRequestDto,
  })
  @IsNotEmpty()
  @IsTimestamp()
  endAt: ITimestamp;

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
