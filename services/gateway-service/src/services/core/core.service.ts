import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { UserBrokerPatterns } from '@shared/patterns/users';
import { MeetingBrokerPatterns } from '@shared/patterns/meetings';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { ICommonMeetingInstance } from '@shared/interfaces/common-instance-meeting.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import {
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
} from '@shared/broker-payloads/users';
import {
  AssignMeetingInstancePayload,
  DeleteMeetingPayload, GetMeetingInstancePayload,
  GetMeetingPayload, UpdateMeetingInstancePayload,
} from '@shared/broker-payloads/meetings';
import { TemplateBrokerPatterns } from '@shared/patterns/templates';

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

  async findUserByEmail(
    payload: FindUserByEmailPayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async validateUser(payload: VerifyPasswordPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.VerifyPassword };

    return this.client.send(pattern, payload).toPromise();
  }

  async comparePasswords(
    payload: ComparePasswordsPayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.ComparePasswords };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUserPassword(
    payload: UpdatePasswordPayload,
  ): Promise<ICommonUserDTO> {
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
  ): Promise<ICommonMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteMeeting(
    payload: DeleteMeetingPayload,
  ): Promise<ICommonMeetingInstance> {
    const pattern = { cmd: MeetingBrokerPatterns.DeleteMeeting };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingById(
    payload: GetMeetingPayload,
  ): Promise<ICommonMeetingInstance> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeeting };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserAndUpdate(
    payload: UpdateProfilePayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfile };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserAndUpdateAvatar(
    payload: UpdateProfileAvatarPayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.UpdateProfileAvatar };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteProfileAvatar(
    payload: DeleteProfileAvatarPayload,
  ): Promise<ICommonUserDTO> {
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

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }

  async uploadTemplateFile(data) {
    const pattern = { cmd: TemplateBrokerPatterns.UploadTemplateFile };

    return this.client.send(pattern, data).toPromise();
  }

  async uploadProfileTemplateFile(data) {
    const pattern = { cmd: TemplateBrokerPatterns.UploadProfileTemplateFile };

    return this.client.send(pattern, data).toPromise();
  }
}
