import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import {
  COMPARE_PASSWORDS,
  DELETE_PROFILE_AVATAR,
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_ID,
  SET_VERIFICATION_CODE,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  UPDATE_PROFILE_AVATAR,
  USER_EXISTS,
  USER_TOKEN_EXISTS,
  VALIDATE_VERIFICATION_CODE,
  VERIFY_PASSWORD,
} from '@shared/patterns/users';
import {
  CREATE_MEETING,
  DELETE_MEETING,
  GET_MEETING,
} from '@shared/patterns/meetings';
import { IUserCredentials } from '@shared/types/registerUser.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';
import { IToken } from '@shared/interfaces/token.interface';
import { ICreateMeetingDTO } from '@shared/interfaces/create-meeting.interface';
import { IUpdateProfile } from '@shared/interfaces/update-profile.interface';
import { IUpdateProfileAvatar } from '@shared/interfaces/update-profile-avatar.interface';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async checkIfUserExists({
    email,
  }: {
    email: ICommonUserDTO['email'];
  }): Promise<boolean> {
    const pattern = { cmd: USER_EXISTS };

    return this.client.send(pattern, { email }).toPromise();
  }

  async checkIfUserTokenExists(token: IToken['token']): Promise<boolean> {
    const pattern = { cmd: USER_TOKEN_EXISTS };

    return this.client.send(pattern, token).toPromise();
  }

  async setVerificationCode(data: { code: string; userId: string }) {
    const pattern = { cmd: SET_VERIFICATION_CODE };

    return this.client.send(pattern, data).toPromise();
  }

  async validateUserCode(data: { code: string; userId: string }) {
    const pattern = { cmd: VALIDATE_VERIFICATION_CODE };

    return this.client.send(pattern, data).toPromise();
  }

  async findUserByEmail({
    email,
  }: {
    email: ICommonUserDTO['email'];
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_EMAIL };

    return this.client.send(pattern, { email }).toPromise();
  }

  async findUserById(data: {
    userId: ICommonUserDTO['id'];
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_ID };

    return this.client.send(pattern, data).toPromise();
  }

  async validateUser(data: IUserCredentials): Promise<ICommonUserDTO> {
    const pattern = { cmd: VERIFY_PASSWORD };

    return this.client.send(pattern, data).toPromise();
  }

  async comparePasswords(data: IUserCredentials): Promise<ICommonUserDTO> {
    const pattern = { cmd: COMPARE_PASSWORDS };

    return this.client.send(pattern, data).toPromise();
  }

  async updateUserPassword(data: {
    userId: ICommonUserDTO['id'];
    password: ICommonUserDTO['password'];
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: UPDATE_PASSWORD };

    return this.client.send(pattern, data).toPromise();
  }

  async createMeeting(
    createMeetingData: ICreateMeetingDTO,
  ): Promise<ICommonMeetingInstanceDTO> {
    const pattern = { cmd: CREATE_MEETING };

    return this.client.send(pattern, createMeetingData).toPromise();
  }

  async deleteMeeting(deleteMeetingData: {
    templateId: string;
  }): Promise<ICommonMeetingInstanceDTO> {
    const pattern = { cmd: DELETE_MEETING };

    return this.client.send(pattern, deleteMeetingData).toPromise();
  }

  async findMeetingById(data: {
    meetingId: ICommonMeetingInstanceDTO['id'];
  }): Promise<ICommonMeetingInstanceDTO> {
    const pattern = { cmd: GET_MEETING };

    return this.client.send(pattern, data).toPromise();
  }

  async findUserAndUpdate(data: {
    userId: string;
    data: Partial<IUpdateProfile>;
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: UPDATE_PROFILE };

    return this.client.send(pattern, data).toPromise();
  }

  async findUserAndUpdateAvatar(data: {
    userId: string;
    data: IUpdateProfileAvatar;
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: UPDATE_PROFILE_AVATAR };

    return this.client.send(pattern, data).toPromise();
  }

  async deleteProfileAvatar(data): Promise<ICommonUserDTO> {
    const pattern = { cmd: DELETE_PROFILE_AVATAR };

    return this.client.send(pattern, data).toPromise();
  }

  async sendCustom(pattern, data) {
    return this.client.send(pattern, data).toPromise();
  }
}
