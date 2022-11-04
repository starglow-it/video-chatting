import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';
import {
  RoomStatisticBrokerPatterns,
  TemplateBrokerPatterns,
  UserBrokerPatterns,
  MeetingBrokerPatterns,
  CoreBrokerPatterns,
} from 'shared-const';
import {
  ICommonUser,
  ICountryStatistic,
  IRoomsRatingStatistic,
  IMeetingInstance,
  IUserTemplate,
  GetMeetingPayload,
  GetRoomRatingStatisticPayload,
  UpdateRoomRatingStatisticPayload,
  UpdateMeetingInstancePayload,
  GetMeetingInstancePayload,
  AssignMeetingInstancePayload,
  ComparePasswordsPayload,
  DeleteProfileAvatarPayload,
  FindUserByEmailPayload,
  FindUserByIdPayload,
  ResetPasswordPayload,
  SetVerificationCodePayload,
  UpdatePasswordPayload,
  UpdateProfileAvatarPayload,
  UpdateProfilePayload,
  UserExistsPayload,
  UserTokenExistsPayload,
  ValidateVerificationCodePayload,
  VerifyPasswordPayload,
  AddTemplateToUserPayload,
  CountUsersPayload,
  FindUsersPayload,
  ResetTrialNotificationPayload,
} from 'shared-types';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async checkIfUserExists(payload: UserExistsPayload): Promise<boolean> {
    const pattern = { cmd: UserBrokerPatterns.UserExists };

    return this.client.send(pattern, payload).toPromise();
  }

  async checkIfUserTokenExists(
    payload: UserTokenExistsPayload,
  ): Promise<boolean> {
    const pattern = { cmd: UserBrokerPatterns.UserTokenExists };

    return this.client.send(pattern, payload).toPromise();
  }

  async setVerificationCode(payload: SetVerificationCodePayload) {
    const pattern = { cmd: UserBrokerPatterns.SetVerificationCode };

    return this.client.send(pattern, payload).toPromise();
  }

  async validateUserCode(payload: ValidateVerificationCodePayload) {
    const pattern = { cmd: UserBrokerPatterns.ValidateVerificationCode };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserByEmail(payload: FindUserByEmailPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async validateUser(payload: VerifyPasswordPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.VerifyPassword };

    return this.client.send(pattern, payload).toPromise();
  }

  async comparePasswords(
    payload: ComparePasswordsPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.ComparePasswords };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUserPassword(
    payload: UpdatePasswordPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdatePassword };

    return this.client.send(pattern, payload).toPromise();
  }

  async assignMeetingInstance(
    payload: AssignMeetingInstancePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: MeetingBrokerPatterns.AssignMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateMeetingInstance(
    payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async getMeetingInstances(
    payload: GetMeetingInstancePayload,
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingById(payload: GetMeetingPayload): Promise<IMeetingInstance> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeeting };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserAndUpdate(payload: UpdateProfilePayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfile };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserAndUpdateAvatar(
    payload: UpdateProfileAvatarPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfileAvatar };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteProfileAvatar(
    payload: DeleteProfileAvatarPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.DeleteProfileAvatar };

    return this.client.send(pattern, payload).toPromise();
  }

  async resetPassword(payload: ResetPasswordPayload) {
    const pattern = { cmd: UserBrokerPatterns.ResetPassword };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteUser(payload) {
    const pattern = { cmd: UserBrokerPatterns.DeleteProfile };

    return this.client.send(pattern, payload).toPromise();
  }

  async uploadTemplateFile(payload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.UploadTemplateFile };

    return this.client.send(pattern, payload).toPromise();
  }

  async uploadUserTemplateFile(payload) {
    const pattern = { cmd: TemplateBrokerPatterns.UploadUserTemplateFile };

    return this.client.send(pattern, payload).toPromise();
  }

  async uploadProfileTemplateFile(payload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.UploadProfileTemplateFile };

    return this.client.send(pattern, payload).toPromise();
  }

  async getBusinessCategories(payload) {
    const pattern = { cmd: CoreBrokerPatterns.GetBusinessCategories };

    return this.client.send(pattern, payload).toPromise();
  }

  async addTemplateToUser(
    payload: AddTemplateToUserPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async countUsers(payload: CountUsersPayload): Promise<number> {
    const pattern = { cmd: UserBrokerPatterns.CountUsers };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUsers(payload: FindUsersPayload): Promise<ICommonUser[]> {
    const pattern = { cmd: UserBrokerPatterns.FindUsers };

    return this.client.send(pattern, payload).toPromise();
  }

  async getCountryStatistics(payload: any): Promise<ICountryStatistic[]> {
    const pattern = { cmd: CoreBrokerPatterns.GetCountryStatistics };

    return this.client.send(pattern, payload).toPromise();
  }

  async getRoomRatingStatistic(
    payload: GetRoomRatingStatisticPayload,
  ): Promise<IRoomsRatingStatistic[]> {
    const pattern = { cmd: RoomStatisticBrokerPatterns.GetRoomRatingStatistic };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateRoomRatingStatistic(
    payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: RoomStatisticBrokerPatterns.UpdateRoomRatingStatistic,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }

  async resetTrialNotification(
    payload: ResetTrialNotificationPayload,
  ): Promise<any> {
    const pattern = { cmd: UserBrokerPatterns.ResetTrialNotification };

    return this.client.send(pattern, payload).toPromise();
  }
}
