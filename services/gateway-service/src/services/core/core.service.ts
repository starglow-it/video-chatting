import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CORE_PROVIDER,
  StatisticBrokerPatterns,
  TemplateBrokerPatterns,
  UserBrokerPatterns,
  MeetingBrokerPatterns,
  UserTemplatesBrokerPatterns,
} from 'shared-const';

import {
  ICommonUser,
  ICountryStatistic,
  IMeetingInstance,
  EntityList,
  IUserTemplate,
  FindUsersPayload,
  GetMeetingPayload,
  UpdateRoomRatingStatisticPayload,
  UpdateMeetingInstancePayload,
  GetMeetingInstancePayload,
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
  ValidateVerificationCodePayload,
  VerifyPasswordPayload,
  AddTemplateToUserPayload,
  UserTokenExistsPayload,
  CountUsersPayload,
  SearchUsersPayload,
  ManageUserRightsPayload,
  UpdateUserTemplateUsageNumberPayload,
  UpdateCountryStatisticsPayload,
  UploadTemplateFilePayload,
  ICommonTemplate,
  DeleteCommonUserPayload,
  FilterQuery,
  IResouce,
  UpdateTemplatePaymentPayload,
  ITemplatePayment,
  GetTemplatePaymentsPayload,
  GetTemplatePaymentPayload,
} from 'shared-types';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async checkIfUserExists(payload: UserExistsPayload): Promise<boolean> {
    const pattern = { cmd: UserBrokerPatterns.UserExists };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async checkIfUserTokenExists(
    payload: UserTokenExistsPayload,
  ): Promise<boolean> {
    const pattern = { cmd: UserBrokerPatterns.UserTokenExists };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async setVerificationCode(payload: SetVerificationCodePayload) {
    const pattern = { cmd: UserBrokerPatterns.SetVerificationCode };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async validateUserCode(payload: ValidateVerificationCodePayload) {
    const pattern = { cmd: UserBrokerPatterns.ValidateVerificationCode };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUserByEmail(payload: FindUserByEmailPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async validateUser(payload: VerifyPasswordPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.VerifyPassword };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async comparePasswords(
    payload: ComparePasswordsPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.ComparePasswords };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateUserPassword(
    payload: UpdatePasswordPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdatePassword };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateMeetingInstance(
    payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async getMeetingInstances(
    payload: GetMeetingInstancePayload,
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findMeetingById(payload: GetMeetingPayload): Promise<IMeetingInstance> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeeting };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUserAndUpdate(payload: UpdateProfilePayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfile };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUserAndUpdateAvatar(
    payload: UpdateProfileAvatarPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfileAvatar };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async deleteProfileAvatar(
    payload: DeleteProfileAvatarPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.DeleteProfileAvatar };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async resetPassword(payload: ResetPasswordPayload) {
    const pattern = { cmd: UserBrokerPatterns.ResetPassword };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async deleteUser(payload) {
    const pattern = { cmd: UserBrokerPatterns.DeleteProfile };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async getTemplatePayments(
    payload: GetTemplatePaymentsPayload,
  ): Promise<EntityList<ITemplatePayment>> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.GetTemplatePayments,
    };
    return firstValueFrom(this.client.send(pattern, payload));
  }

  async getEnabledTemplatePayment(payload: GetTemplatePaymentPayload): Promise<ITemplatePayment> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.GetTemplatePayment,
    };
    return firstValueFrom(this.client.send(pattern, payload));
  }

  async manageUserRights(
    payload: ManageUserRightsPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.ManageUserRights };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async uploadTemplateFile(payload: UploadTemplateFilePayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.UploadTemplateFile };

    return this.client.send(pattern, payload).toPromise();
  }

  async createUserWithoutLogin(uuid: string): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.CreateUserWithoutLogin };
    return await this.client.send(pattern, { uuid }).toPromise();
  }

  async deleteGlobalUser(payload: DeleteCommonUserPayload) {
    const pattern = { cmd: UserBrokerPatterns.DeleteGlobalUser };
    return firstValueFrom(this.client.send(pattern, payload));
  }

  async uploadUserTemplateFile(payload) {
    const pattern = { cmd: UserTemplatesBrokerPatterns.UploadUserTemplateFile };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async uploadProfileTemplateFile(payload): Promise<void> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.UploadProfileTemplateFile,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async addTemplateToUser(
    payload: AddTemplateToUserPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateTemplatePayment(
    payload: UpdateTemplatePaymentPayload,
  ): Promise<EntityList<ITemplatePayment>> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.UpdateTemplatePayments,
    };
    return firstValueFrom(this.client.send(pattern, payload));
  }

  async countUsers(payload: CountUsersPayload): Promise<number> {
    const pattern = { cmd: UserBrokerPatterns.CountUsers };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUsers(payload: FindUsersPayload): Promise<ICommonUser[]> {
    const pattern = { cmd: UserBrokerPatterns.FindUsers };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async searchUsers(
    payload: SearchUsersPayload,
  ): Promise<EntityList<ICommonUser>> {
    const pattern = { cmd: UserBrokerPatterns.SearchUsers };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateCountryStatistics(
    payload: UpdateCountryStatisticsPayload,
  ): Promise<ICountryStatistic> {
    const pattern = { cmd: StatisticBrokerPatterns.UpdateCountryStatistics };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateRoomRatingStatistic(
    payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateRoomRatingStatistic,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateUserTemplateUsageNumber(
    payload: UpdateUserTemplateUsageNumberPayload,
  ): Promise<any> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.UpdateUserTemplateUsageNumber,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }

  async findCommonTemplateByTemplate(
    payload: FilterQuery<ICommonTemplate & { _id: string }>,
  ): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return firstValueFrom(this.client.send(pattern, payload));
  }
}
