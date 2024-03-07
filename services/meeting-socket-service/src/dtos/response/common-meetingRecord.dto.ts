import { Expose, Transform, Type } from 'class-transformer';
import { ICommonRecordDTO } from '../../interfaces/common-record.interface';
import { MeetingRecordDocument } from '../../schemas/meeting-record.schema';
import { CommonMeetingDTO } from './common-meeting.dto';
import { serializeInstance } from '../serialization';

export class CommonRecordDTO implements ICommonRecordDTO {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  @Transform((data) => data.obj['meetingId']?.toString())
  meetingId: ICommonRecordDTO['meetingId'];

  @Expose()
  user: ICommonRecordDTO['user'];

  @Expose()
  url: ICommonRecordDTO['url'];

  @Expose()
  price: ICommonRecordDTO['price'];

  @Expose()
  createdAt: ICommonRecordDTO['createdAt'];

  @Expose()
  updatedAt: ICommonRecordDTO['updatedAt'];
}

export const recordSerialization = <
  D extends MeetingRecordDocument | MeetingRecordDocument[],
>(
  record: D,
) => serializeInstance(record, CommonRecordDTO);
