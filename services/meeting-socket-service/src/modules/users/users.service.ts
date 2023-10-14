import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import {
  MeetingUser,
  MeetingUserDocument,
} from '../../schemas/meeting-user.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  CustomPopulateOptions,
  UserActionInMeeting,
  UserActionInMeetingParams,
} from '../../types';
import {
  IUserTemplate,
  MeetingAccessStatusEnum,
  MeetingRole,
} from 'shared-types';
import { Socket } from 'socket.io';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CoreService } from '../../services/core/core.service';
import { replaceItemInArray } from '../../utils/replaceItemInArray';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(MeetingUser.name)
    private meetingUser: Model<MeetingUserDocument>,
    private coreService: CoreService,
  ) {}

  async createUser(
    data: any,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    const [user] = await this.meetingUser.create([data], { session });

    return user;
  }

  async updateOne(
    query,
    data: UpdateQuery<ICommonMeetingUserDTO>,
    { session }: ITransactionSession,
  ): Promise<UpdateWriteOpResult> {
    return this.meetingUser.updateOne(query, data, { new: true, session });
  }

  async updateMany(
    query,
    data,
    { session }: ITransactionSession,
  ): Promise<UpdateWriteOpResult> {
    return this.meetingUser.updateMany(query, data, { new: true, session });
  }

  async findOne({
    query,
    session,
    populatePaths,
  }: {
    query: FilterQuery<MeetingUserDocument>;
    session: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<MeetingUserDocument> {
    return this.meetingUser
      .findOne(
        query,
        {},
        { populate: populatePaths, session: session?.session },
      )
      .exec();
  }

  async countMany(query: FilterQuery<MeetingUserDocument>) {
    return this.meetingUser.find(query).count().exec();
  }

  async findById(
    id: string,
    session?: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findById(id, {}, { session: session?.session });
  }

  async findOneAndUpdate(
    query: FilterQuery<MeetingUserDocument>,
    data: Partial<MeetingUserDocument>,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findOneAndUpdate(query, data, {
      new: true,
      session,
    });
  }

  async findByIdAndUpdate(
    id,
    data,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findByIdAndUpdate(id, data, { new: true, session });
  }

  async deleteUser(query, { session }: ITransactionSession) {
    return this.meetingUser.findOneAndDelete(query, { session });
  }

  async deleteMany(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingUser.deleteMany(query, { session });

    return;
  }

  async findUsers(
    query,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument[]> {
    return this.meetingUser.find(query, {}, { session }).exec();
  }

  async updateSizeAndPositionForUser({
    userTemplate,
    userId,
    event,
  }: {
    userTemplate: IUserTemplate;
    userId: string;
    event: UserActionInMeeting;
  }) {
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

    const index = replaceItemInArray(
      userTemplate.indexUsers,
      updateIndexParams[event].condition,
      updateIndexParams[event].replaceItem,
    );

    if (!index && typeof index !== 'number') return;

    await this.coreService.updateUserTemplate({
      templateId: userTemplate.id,
      userId,
      data: {
        indexUsers: userTemplate.indexUsers,
      },
    });

    return {
      position: userTemplate.usersPosition[index],
      size: userTemplate.usersSize[index],
    };
  }
}
