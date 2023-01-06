import { Injectable } from '@nestjs/common';

import {
    ComparePasswordsPayload,
    CountUsersPayload,
    DeleteProfileAvatarPayload,
    EntityList, FindUserByEmailPayload, FindUserByIdPayload,
    FindUsersPayload,
    ICommonUser,
    ManageUserRightsPayload,
    ResetPasswordPayload,
    SearchUsersPayload, SetVerificationCodePayload,
    UpdatePasswordPayload,
    UpdateProfileAvatarPayload,
    UpdateProfilePayload,
    UserExistsPayload,
    UserTokenExistsPayload, ValidateVerificationCodePayload, VerifyPasswordPayload
} from "shared-types";
import {UserBrokerPatterns} from "shared-const";

import {CoreService} from "../../services/core/core.service";

@Injectable()
export class UsersService {
    constructor(private coreService: CoreService) {}

    async searchUsers(
        payload: SearchUsersPayload,
    ): Promise<EntityList<ICommonUser>> {
        const pattern = { cmd: UserBrokerPatterns.SearchUsers };

        return this.coreService.sendCustom(pattern, payload);
    }

    async findUsers(payload: FindUsersPayload): Promise<ICommonUser[]> {
        const pattern = { cmd: UserBrokerPatterns.FindUsers };

        return this.coreService.sendCustom(pattern, payload);
    }

    async findUserAndUpdate(payload: UpdateProfilePayload): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.UpdateProfile };

        return this.coreService.sendCustom(pattern, payload);
    }

    async countUsers(payload: CountUsersPayload): Promise<number> {
        const pattern = { cmd: UserBrokerPatterns.CountUsers };

        return this.coreService.sendCustom(pattern, payload);
    }

    async manageUserRights(
        payload: ManageUserRightsPayload,
    ): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.ManageUserRights };

        return this.coreService.sendCustom(pattern, payload);
    }

    async deleteUser(payload) {
        const pattern = { cmd: UserBrokerPatterns.DeleteProfile };

        return this.coreService.sendCustom(pattern, payload);
    }

    async resetPassword(payload: ResetPasswordPayload) {
        const pattern = { cmd: UserBrokerPatterns.ResetPassword };

        return this.coreService.sendCustom(pattern, payload);
    }

    async deleteProfileAvatar(
        payload: DeleteProfileAvatarPayload,
    ): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.DeleteProfileAvatar };

        return this.coreService.sendCustom(pattern, payload);
    }

    async findUserAndUpdateAvatar(
        payload: UpdateProfileAvatarPayload,
    ): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.UpdateProfileAvatar };

        return this.coreService.sendCustom(pattern, payload);
    }

    async updateUserPassword(
        payload: UpdatePasswordPayload,
    ): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.UpdatePassword };

        return this.coreService.sendCustom(pattern, payload);
    }

    async comparePasswords(
        payload: ComparePasswordsPayload,
    ): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.ComparePasswords };

        return this.coreService.sendCustom(pattern, payload);
    }

    async checkIfUserExists(payload: UserExistsPayload): Promise<boolean> {
        const pattern = { cmd: UserBrokerPatterns.UserExists };

        return this.coreService.sendCustom(pattern, payload);
    }

    async checkIfUserTokenExists(
        payload: UserTokenExistsPayload,
    ): Promise<boolean> {
        const pattern = { cmd: UserBrokerPatterns.UserTokenExists };

        return this.coreService.sendCustom(pattern, payload);
    }

    async setVerificationCode(payload: SetVerificationCodePayload) {
        const pattern = { cmd: UserBrokerPatterns.SetVerificationCode };

        return this.coreService.sendCustom(pattern, payload);
    }

    async validateUserCode(payload: ValidateVerificationCodePayload) {
        const pattern = { cmd: UserBrokerPatterns.ValidateVerificationCode };

        return this.coreService.sendCustom(pattern, payload);
    }

    async findUserByEmail(payload: FindUserByEmailPayload): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

        return this.coreService.sendCustom(pattern, payload);
    }

    async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.FindUserById };

        return this.coreService.sendCustom(pattern, payload);
    }

    async validateUser(payload: VerifyPasswordPayload): Promise<ICommonUser> {
        const pattern = { cmd: UserBrokerPatterns.VerifyPassword };

        return this.coreService.sendCustom(pattern, payload);
    }
}
