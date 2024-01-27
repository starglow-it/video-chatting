import { Expose, Transform, Type } from 'class-transformer';
import { IMeetingQuestionAnswer } from '../../interfaces/meeting-question-answer.interface';
import { MeetingQuestionAnswerDocument } from '../../schemas/meeting-question-answer.schema';
import { ICommonMeetingDTO } from '../../interfaces/common-meeting.interface';
import { CommonMeetingDTO } from './common-meeting.dto';
import { ISenderDto } from '../../interfaces/sender.interface';
import { SenderDto } from './sender.dto';
import { serializeInstance } from '../serialization';

export class MeetingQuestionAnswerDto implements IMeetingQuestionAnswer {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  body: string;

  @Expose()
  @Type(() => SenderDto)
  sender: ISenderDto;

  @Expose()
  @Type(() => CommonMeetingDTO)
  meeting: ICommonMeetingDTO;

  @Expose()
  @Transform(({ obj }) => Object.fromEntries(obj['reactions']))
  reactions: IMeetingQuestionAnswer['reactions'];

  @Expose()
  createdAt: Date;
}

export const meetingQuestionAnswerSerialization = <
  D extends MeetingQuestionAnswerDocument | MeetingQuestionAnswerDocument[],
>(
  meetingQuestionAnswer: D,
) => serializeInstance(meetingQuestionAnswer, MeetingQuestionAnswerDto);
