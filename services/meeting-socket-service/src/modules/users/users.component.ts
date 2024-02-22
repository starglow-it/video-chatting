import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  GetModelByIdQuery,
  GetModelSingleQuery,
  UpdateModelByIdQuery,
  UpdateModelSingleQuery,
} from '../../types/mongoose';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { throwWsError } from '../../utils/ws/wsError';
import { MeetingNativeErrorEnum } from 'shared-const';

@Injectable()
export class UsersComponent {
  constructor(private readonly usersService: UsersService) {}

  async findMeetingFromPopulateUser(user: MeetingUserDocument) {
    await user.populate('meeting');
    throwWsError(!user.meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);
    return user.meeting;
  }

  async findByIdAndUpdate({
    id,
    data,
    session,
  }: UpdateModelByIdQuery<MeetingUserDocument>) {
    const user = await this.usersService.findByIdAndUpdate(id, data, session);
    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);
    return user;
  }

  async findOneAndUpdate(args: UpdateModelSingleQuery<MeetingUserDocument>) {
    const user = await this.usersService.findOneAndUpdate(args);
    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);
    return user;
  }

  async findById({ id, session }: GetModelByIdQuery<MeetingUserDocument>) {
    const user = await this.usersService.findById({ id, session });
    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);
    return user;
  }

  async findOne({
    query,
    session,
    populatePaths,
  }: GetModelSingleQuery<MeetingUserDocument>) {
    const user = await this.usersService.findOne({
      query,
      session,
      populatePaths,
    });
    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);
    return user;
  }

  async findUsers({
    query,
    session,
    populatePaths,
  }: GetModelSingleQuery<MeetingUserDocument>) {
    const user = await this.usersService.findUsers({
      query,
      session,
      populatePaths,
    });
    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);
    return user;
  }
}
