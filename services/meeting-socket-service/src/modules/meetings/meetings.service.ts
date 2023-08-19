import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from '../../schemas/meeting.schema';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  CustomPopulateOptions,
  UserActionInMeeting,
  UserActionInMeetingParams,
} from '../../types/common';
import { IUserTemplate } from 'shared-types';
import { CoreService } from '../../services/core/core.service';
@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meeting: Model<MeetingDocument>,
    private coreService: CoreService,
  ) {}

  private logger = new Logger(MeetingsService.name);

  async createMeeting(
    data: any,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    const [meeting] = await this.meeting.create([data], { session });

    return meeting;
  }

  async findOne(
    query: any,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting.findOne(query, {}, { session }).exec();
  }

  async findById(
    id: string,
    session?: ITransactionSession,
    populatePaths?: CustomPopulateOptions,
  ): Promise<MeetingDocument> {
    return this.meeting
      .findById(id, {}, { populate: populatePaths, session: session?.session })
      .exec();
  }

  async addUserToMeeting(
    {
      meetingId,
      userId,
    }: {
      meetingId: MeetingDocument['id'];
      userId: MeetingUserDocument['_id'];
    },
    { session }: ITransactionSession,
  ) {
    return this.meeting
      .findByIdAndUpdate(
        meetingId,
        { $push: { users: userId } },
        { session, new: true },
      )
      .exec();
  }

  async removeUserFromMeeting(
    {
      userId,
    }: {
      userId: MeetingUserDocument['_id'];
    },
    { session }: ITransactionSession,
  ) {
    return this.meeting
      .findOneAndUpdate(
        { users: userId },
        { $pull: { users: userId } },
        { new: true },
      )
      .session(session);
  }

  async deleteById(
    { meetingId },
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.meeting.deleteOne({ _id: meetingId }).session(session);

    return;
  }

  async updateMeetingById(
    meetingId,
    data,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting
      .findByIdAndUpdate(meetingId, data, {
        session,
        new: true,
      })
      .exec();
  }

  async findByIdAndUpdate(
    meetingId,
    data,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting
      .findByIdAndUpdate(meetingId, data, {
        session,
        new: true,
      })
      .exec();
  }

  async updateIndexUsers({
    userTemplate,
    user,
    event,
  }: {
    userTemplate: IUserTemplate;
    user: MeetingUserDocument;
    event: UserActionInMeeting;
  }) {
    try {
      const userId = user._id.toString();
      const updateIndexParams: UserActionInMeetingParams = {
        [UserActionInMeeting.Join]: {
          condition: null,
          replaceItem: userId,
        },
        [UserActionInMeeting.Leave]: {
          condition: userId,
          replaceItem: null,
        },
      };

      const params = updateIndexParams[event];

      const index = userTemplate.indexUsers.indexOf(params.condition);
      if (index + 1) {
        userTemplate.indexUsers[index] = params.replaceItem;

        await this.coreService.updateUserTemplate({
          templateId: userTemplate.id,
          userId,
          data: {
            indexUsers: userTemplate.indexUsers,
          },
        });
      }
    } catch (err) {
      this.logger.error({
        message: err.message,
        event,
      });
      return;
    }
  }
}
