import { Controller } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

// dtos
import { CommonUserDTO } from '../../dtos/common-user.dto';

// shared
import { UserBrokerPatterns, AuthBrokerPatterns } from 'shared-const';
import {
  TokenTypes,
  FindUsersPayload,
  ComparePasswordsPayload,
  CreateUserPayload,
  DeleteProfileAvatarPayload,
  FindUserByEmailAndUpdatePayload,
  FindUserByEmailPayload,
  FindUserByIdPayload,
  FindUserPayload,
  FindUsersByIdPayload,
  ResetPasswordPayload,
  SetVerificationCodePayload,
  UpdatePasswordPayload,
  UpdateProfileAvatarPayload,
  CountUsersPayload,
  UpdateProfilePayload,
  UpdateUserPayload,
  UserExistsPayload,
  ValidateVerificationCodePayload,
  VerifyPasswordPayload,
  LoginUserByEmailPayload,
  SetResetPasswordTokenPayload,
  ResetTrialNotificationPayload,
} from 'shared-types';

import {
  INVALID_CREDENTIALS,
  INVALID_PASSWORD,
  NOT_MATCH_PASSWORD,
  SAME_RESET_PASSWORD,
  USER_NOT_FOUND,
  USER_TOKEN_NOT_FOUND,
  USERS_SERVICE,
  plans,
} from 'shared-const';

import { getRandomHexColor } from 'shared-utils';

// mongo
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';

// services
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { ConfigClientService } from '../../services/config/config.service';
import { LanguagesService } from '../languages/languages.service';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { UsersService } from './users.service';
import { UserTokenService } from '../user-token/user-token.service';

// types
import { addMonthsCustom } from '../../utils/dates/addMonths';
import { TasksService } from '../tasks/tasks.service';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import { TimeoutTypesEnum } from 'shared-types';
import { addDaysCustom } from '../../utils/dates/addDaysCustom';
import { CountryStatisticsService } from '../country-statistics/country-statistics.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
    private languagesService: LanguagesService,
    private userTokenService: UserTokenService,
    private businessCategoriesService: BusinessCategoriesService,
    private awsService: AwsConnectorService,
    private configService: ConfigClientService,
    private verificationCodeService: VerificationCodeService,
    private countryStatisticsService: CountryStatisticsService,
    @InjectConnection() private connection: Connection,
  ) {}

  startCheckSubscriptions() {
    this.tasksService.addInterval({
      name: 'checkSubscriptions',
      ts: getTimeoutTimestamp({
        value: 1,
        type: TimeoutTypesEnum.Hours,
      }),
      callback: this.checkSubscriptions.bind(this),
    });
  }

  async checkSubscriptions() {
    const environment = await this.configService.get('environment');

    const users = await this.usersService.findUsers({
      query: {},
    });

    const usersPromises = users.map(async (user) => {
      const productKey = user.subscriptionPlanKey;

      if (productKey === 'House') {
        if (user.renewSubscriptionTimestampInSeconds < Date.now() / 1000) {
          const plan = plans[productKey];

          const nextRenewDate =
            environment === 'demo'
              ? addMonthsCustom(Date.now(), 1)
              : addDaysCustom(Date.now(), 1);

          const nextRenewDateInSeconds = nextRenewDate.getTime() / 1000;

          await this.usersService.findByIdAndUpdate(user._id, {
            maxMeetingTime: plan.features.timeLimit,
            maxTemplatesNumber: plan.features.templatesLimit,
            renewSubscriptionTimestampInSeconds: Math.floor(
              nextRenewDateInSeconds,
            ),
          });
        }
      }

      return;
    });

    await Promise.all(usersPromises);
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UserExists })
  async checkIfUserExists(@Payload() { email }: UserExistsPayload) {
    try {
      return this.usersService.exists({ email });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: UserBrokerPatterns.CreateUser })
  async createUser(@Payload() createUserPayload: CreateUserPayload) {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        try {
          const environment = await this.configService.get('environment');

          const renewSubscriptionTimestampInSeconds =
            (environment === 'demo'
              ? addMonthsCustom(Date.now(), 1)
              : addDaysCustom(Date.now(), 1)
            ).getTime() / 1000;

          const newUser = await this.usersService.createUser(
            {
              ...createUserPayload.user,
              registerTemplate: createUserPayload.user.templateId,
              renewSubscriptionTimestampInSeconds,
            },
            session,
          );

          const token = await this.userTokenService.createToken(
            {
              user: newUser._id,
              token: createUserPayload.token,
            },
            session,
          );

          newUser.tokens.push(token);

          await newUser.save();

          if (createUserPayload?.user?.country) {
            const isCountryExists = await this.countryStatisticsService.exists({
              key: createUserPayload.user.country,
            });

            if (isCountryExists) {
              await this.countryStatisticsService.updateOne({
                query: {
                  key: createUserPayload.user.country,
                },
                data: {
                  $inc: { value: 1 },
                },
                session,
              });
            } else {
              await this.countryStatisticsService.create({
                data: {
                  key: createUserPayload.user.country,
                  value: 1,
                  color: getRandomHexColor(75, 200),
                },
                session,
              });
            }
          }

          return plainToClass(CommonUserDTO, newUser, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });
        } catch (err) {
          throw new RpcException({
            message: err.message,
            ctx: USERS_SERVICE,
          });
        }
      },
    );
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UpdateUser })
  async updateUser(@Payload() updateUserData: UpdateUserPayload) {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        try {
          const updatedUser = await this.usersService.findUserAndUpdate(
            updateUserData.query,
            updateUserData.data,
            session,
          );

          return plainToClass(CommonUserDTO, updatedUser, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });
        } catch (err) {
          throw new RpcException({
            message: err.message,
            ctx: USERS_SERVICE,
          });
        }
      },
    );
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUserByEmail })
  async findUserByEmail(@Payload() data: FindUserByEmailPayload) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findUser({
        query: { email: data.email },
        session,
      });

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUserById })
  async findUserById(@Payload() data: FindUserByIdPayload) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(data.userId, session, [
        'businessCategories',
        'socials',
        'languages',
        'profileAvatar',
      ]);

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUsersById })
  async findUsersById(@Payload() payload: FindUsersByIdPayload) {
    return withTransaction(this.connection, async (session) => {
      const users = await this.usersService.findUsers({
        query: { _id: { $in: payload.userIds } },
        session,
      });

      return plainToInstance(CommonUserDTO, users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUser })
  async findUser(@Payload() payload: FindUserPayload) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findUser({
        query: payload,
        session,
        populatePaths: [
          'businessCategories',
          'socials',
          'languages',
          'profileAvatar',
        ],
      });

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUsers })
  async findUsers(@Payload() { query, options }: FindUsersPayload) {
    return withTransaction(this.connection, async (session) => {
      const users = await this.usersService.findUsers({
        query: {
          ...(options?.search
            ? {
                ...query,
                $or: [
                  { companyName: { $regex: options?.search, $options: 'i' } },
                  { fullName: { $regex: options?.search, $options: 'i' } },
                  { email: { $regex: options?.search, $options: 'i' } },
                ],
              }
            : query),
        },
        options: {
          skip: options?.skip,
          limit: options?.limit,
          sort: options?.sort,
        },
        session,
        populatePaths: [
          'businessCategories',
          'socials',
          'languages',
          'profileAvatar',
        ],
      });

      return plainToInstance(CommonUserDTO, users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.FindUserByEmailAndUpdate })
  async findUserByEmailAndUpdate(
    @Payload()
    { email, data }: FindUserByEmailAndUpdatePayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const userData = await this.usersService.findUserAndUpdate(
        { email },
        data,
        session,
      );

      if (!userData) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      return plainToClass(CommonUserDTO, userData, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.VerifyPassword })
  async verifyPassword(@Payload() payload: VerifyPasswordPayload) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findUser({
        query: {
          ...(payload.userId && { _id: payload.userId }),
          ...(payload.email && { email: payload.email }),
        },
        session,
      });

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      const isPasswordValid = await this.usersService.verifyPassword(
        payload.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new RpcException({
          ...(payload.userId ? INVALID_PASSWORD : INVALID_CREDENTIALS),
          ctx: USERS_SERVICE,
        });
      }

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.ComparePasswords })
  async comparePasswords(@Payload() payload: ComparePasswordsPayload) {
    const user = await this.usersService.findUser({
      query: { _id: payload.userId },
    });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    return this.usersService.verifyPassword(payload.password, user.password);
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UpdatePassword })
  async updatePassword(
    @Payload()
    payload: UpdatePasswordPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const hashPass = await this.usersService.hashPassword(payload.password);

      const user = await this.usersService.findByIdAndUpdate(
        payload.userId,
        { password: hashPass },
        session,
      );

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.SetVerificationCode })
  async setVerificationCode(@Payload() payload: SetVerificationCodePayload) {
    try {
      return withTransaction(
        this.connection,
        async (session: ITransactionSession) => {
          const user = await this.usersService.findById(
            payload.userId,
            session,
          );

          await this.verificationCodeService.deleteUserCode(
            { userId: user._id },
            session,
          );

          return this.verificationCodeService.createUserCode(
            { code: payload.code, userId: user._id },
            session,
          );
        },
      );
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: UserBrokerPatterns.ValidateVerificationCode })
  async validateVerificationCode(
    @Payload() payload: ValidateVerificationCodePayload,
  ) {
    try {
      return withTransaction(
        this.connection,
        async (session: ITransactionSession) => {
          const user = await this.usersService.findById(
            payload.userId,
            session,
          );
          const isCodeValid = await this.verificationCodeService.exists({
            value: payload.code,
            userId: user._id,
          });

          if (!isCodeValid) {
            throw new RpcException({
              message: 'user.code.invalid',
              ctx: USERS_SERVICE,
            });
          }
          return isCodeValid;
        },
      );
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.LoginUserByEmail })
  async loginUserByEmail(@Payload() loginData: LoginUserByEmailPayload) {
    const user = await this.usersService.findUser({
      query: { email: loginData.email },
    });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    return plainToInstance(CommonUserDTO, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.DeleteProfile })
  async deleteProfile(@Payload() { userId }: { userId: string }) {
    return withTransaction(this.connection, async (session) => {
      return this.usersService.deleteUser(userId, session);
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UpdateProfile })
  async updateProfile(@Payload() { userId, data }: UpdateProfilePayload) {
    return withTransaction(this.connection, async (session) => {
      const updateData = this.usersService.prepareUserUpdateData(data);

      const user = await this.usersService.findByIdAndUpdate(
        userId,
        updateData,
        session,
      );

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      if ('businessCategories' in data) {
        const newBusinessCategories = await this.businessCategoriesService.find(
          {
            query: { key: { $in: data.businessCategories } },
            session,
          },
        );

        user.businessCategories =
          newBusinessCategories.map((category) => category._id) || [];
      }

      if ('languages' in data) {
        user.languages =
          (await this.languagesService.find({
            query: { key: { $in: data.languages } },
            session,
          })) || [];
      }

      if ('socials' in data) {
        user.socials =
          (await this.usersService.createSocialsLinks(
            { userId, socials: data.socials },
            session,
          )) || [];
      }

      if (data?.country) {
        const isCountryExists = await this.countryStatisticsService.exists({
          key: data.country,
        });

        if (isCountryExists) {
          await this.countryStatisticsService.updateOne({
            query: {
              key: data.country,
            },
            data: {
              $inc: { value: 1 },
            },
            session,
          });
        } else {
          await this.countryStatisticsService.create({
            data: {
              key: data.country,
              value: 1,
              color: getRandomHexColor(75, 200),
            },
            session,
          });
        }
      }

      await user.save();

      await user.populate([
        'businessCategories',
        'languages',
        'socials',
        'profileAvatar',
      ]);

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UpdateProfileAvatar })
  async updateProfileAvatar(
    @Payload() { userId, data }: UpdateProfileAvatarPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const vultrStorageHostname = await this.configService.get(
        'vultrStorageHostname',
      );
      const vultrUploadBucket = await this.configService.get(
        'vultrUploadBucket',
      );

      const uploadKey = data.profileAvatar.replace(
        `https://${vultrStorageHostname}/${vultrUploadBucket}/`,
        '',
      );

      const [profileAvatar] = await this.usersService.createProfileAvatar(
        {
          url: data.profileAvatar,
          size: data.size,
          mimeType: data.mimeType,
          key: uploadKey,
        },
        session,
      );

      const user = await this.usersService.findById(userId, session);

      await user.populate('profileAvatar');

      if (user.profileAvatar) {
        await this.usersService.deleteProfileAvatar(
          user.profileAvatar._id,
          session,
        );
        await this.awsService.deleteResource(user.profileAvatar.key);
      }

      user.profileAvatar = profileAvatar._id;

      await user.save({ session: session?.session });

      await user.populate([
        'businessCategories',
        'languages',
        'socials',
        'profileAvatar',
      ]);

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.DeleteProfileAvatar })
  async deleteProfileAvatar(@Payload() { userId }: DeleteProfileAvatarPayload) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(userId, session);

      await user.populate('profileAvatar');

      if (user.profileAvatar) {
        await this.usersService.deleteProfileAvatar(
          user.profileAvatar._id,
          session,
        );
        await this.awsService.deleteResource(user.profileAvatar.key);
      }

      user.profileAvatar = null;

      await user.populate([
        'businessCategories',
        'languages',
        'socials',
        'profileAvatar',
      ]);

      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.SetResetPasswordToken })
  async setResetPasswordToken(
    @Payload()
    data: SetResetPasswordTokenPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findUser({
        query: { email: data.email },
        session,
      });

      await this.userTokenService.deleteManyTokens(
        { user: user._id, type: TokenTypes.ResetPassword },
        session,
      );

      const token = await this.userTokenService.createToken(
        {
          user: user._id,
          token: data.token,
        },
        session,
      );

      await this.usersService.findUserAndUpdate(
        { userId: user.id },
        { isResetPasswordActive: true },
        session,
      );

      user.tokens.push(token);

      await user.save();

      return;
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.ResetPassword })
  async resetPassword(
    @Payload()
    payload: ResetPasswordPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const isUserTokenExists = await this.userTokenService.exists(
        payload.token,
      );

      if (!isUserTokenExists) {
        throw new RpcException(USER_TOKEN_NOT_FOUND);
      }

      if (payload.newPassword !== payload.newPasswordRepeat) {
        throw new RpcException(NOT_MATCH_PASSWORD);
      }

      const token = await this.userTokenService.findOne({
        query: {
          token: payload.token,
        },
        session,
        populatePath: 'user',
      });

      const user = await this.usersService.findById(token.user._id, session);

      const isSamePassword = await this.usersService.verifyPassword(
        payload.newPassword,
        user.password,
      );

      if (isSamePassword) {
        throw new RpcException(SAME_RESET_PASSWORD);
      }

      const hashPass = await this.usersService.hashPassword(
        payload.newPassword,
      );

      await this.usersService.findByIdAndUpdate(
        user._id,
        { password: hashPass, isResetPasswordActive: false },
        session,
      );

      await this.userTokenService.deleteToken({ token: token.token }, session);
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.CountUsers })
  async countUsers(@Payload() payload: CountUsersPayload): Promise<number> {
    return withTransaction(this.connection, async (session) => {
      return this.usersService.count({ query: payload, session });
    });
  }

  @MessagePattern({ cmd: UserBrokerPatterns.ResetTrialNotification })
  async resetTrialNotification(
    @Payload() payload: ResetTrialNotificationPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findByIdAndUpdate(
        payload.userId,
        { shouldShowTrialExpiredNotification: false },
        session,
      );
      return plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }
}
