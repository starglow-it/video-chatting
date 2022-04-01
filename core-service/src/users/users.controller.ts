import { Controller } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

// dtos
import { CommonUserDTO } from '../dtos/common-user.dto';

// shared
import {
  COMPARE_PASSWORDS,
  CREATE_USER,
  DELETE_PROFILE_AVATAR,
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_EMAIL_AND_UPDATE,
  FIND_USER_BY_ID,
  LOGIN_USER_BY_EMAIL,
  SET_VERIFICATION_CODE,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  UPDATE_PROFILE_AVATAR,
  USER_EXISTS,
  VALIDATE_VERIFICATION_CODE,
  VERIFY_PASSWORD,
} from '@shared/patterns/users';
import {
  IUserCredentials,
  UserCredentialsWithTokenPair,
} from '@shared/types/registerUser.type';
import {
  INVALID_CREDENTIALS,
  INVALID_PASSWORD,
  USER_NOT_FOUND,
} from '@shared/const/errors/users';

// mongo
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';

// interfaces
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IUpdateProfile } from '@shared/interfaces/update-profile.interface';
import { IUpdateProfileAvatar } from '@shared/interfaces/update-profile-avatar.interface';

// services
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { AwsConnectorService } from '../aws-connector/aws-connector.service';
import { ConfigClientService } from '../config/config.service';
import { LanguagesService } from '../languages/languages.service';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { UsersService } from './users.service';
import { UserTokenService } from '../user-token/user-token.service';

// const
import { USERS_SERVICE } from '@shared/const/services.const';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private languagesService: LanguagesService,
    private userTokenService: UserTokenService,
    private businessCategoriesService: BusinessCategoriesService,
    private awsService: AwsConnectorService,
    private configService: ConfigClientService,
    private verificationCodeService: VerificationCodeService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: USER_EXISTS })
  async checkIfUserExists(
    @Payload() { email }: { email: ICommonUserDTO['email'] },
  ) {
    try {
      return this.usersService.exists({ email });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: CREATE_USER })
  async createUser(@Payload() registerUserData: UserCredentialsWithTokenPair) {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        try {
          const newUser = await this.usersService.createUser(
            registerUserData.user,
            session,
          );

          const token = await this.userTokenService.createToken(
            {
              user: newUser._id,
              token: registerUserData.token,
            },
            session,
          );

          newUser.tokens.push(token);

          await newUser.save();

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

  @MessagePattern({ cmd: FIND_USER_BY_EMAIL })
  async findUserByEmail(@Payload() data: { email: ICommonUserDTO['email'] }) {
    const user = await this.usersService.findUser({ email: data.email });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    return plainToClass(CommonUserDTO, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @MessagePattern({ cmd: FIND_USER_BY_ID })
  async findUserById(@Payload() data: { userId: ICommonUserDTO['id'] }) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(data.userId, session);

      await user.populate([
        'businessCategories',
        'socials',
        'languages',
        'profileAvatar',
      ]);

      if (!user) {
        throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
      }

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: FIND_USER_BY_EMAIL_AND_UPDATE })
  async findUserByEmailAndUpdate(
    @Payload()
    {
      email,
      data,
    }: {
      email: ICommonUserDTO['email'];
      data: Partial<ICommonUserDTO>;
    },
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

  @MessagePattern({ cmd: VERIFY_PASSWORD })
  async verifyPassword(@Payload() verifyData: IUserCredentials) {
    const user = await this.usersService.findUser({
      ...(verifyData.userId && { _id: verifyData.userId }),
      ...(verifyData.email && { email: verifyData.email }),
    });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    const isPasswordValid = await this.usersService.verifyPassword(
      verifyData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        ...(verifyData.userId ? INVALID_PASSWORD : INVALID_CREDENTIALS),
        ctx: USERS_SERVICE,
      });
    }

    return plainToClass(CommonUserDTO, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @MessagePattern({ cmd: COMPARE_PASSWORDS })
  async comparePasswords(
    @Payload() compareData: { userId: string; password: string },
  ) {
    const user = await this.usersService.findUser({ _id: compareData.userId });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    return this.usersService.verifyPassword(
      compareData.password,
      user.password,
    );
  }

  @MessagePattern({ cmd: UPDATE_PASSWORD })
  async updatePassword(
    @Payload()
    updateData: {
      userId: ICommonUserDTO['id'];
      password: ICommonUserDTO['password'];
    },
  ) {
    return withTransaction(this.connection, async (session) => {
      const hashPass = await this.usersService.hashPassword(
        updateData.password,
      );

      const user = await this.usersService.findByIdAndUpdate(
        updateData.userId,
        { password: hashPass },
        session,
      );

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: SET_VERIFICATION_CODE })
  async setVerificationCode(@Payload() data: { code: string; userId: string }) {
    try {
      return withTransaction(
        this.connection,
        async (session: ITransactionSession) => {
          const user = await this.usersService.findById(data.userId, session);

          await this.verificationCodeService.deleteUserCode(
            { userId: user._id },
            session,
          );

          return this.verificationCodeService.createUserCode(
            { code: data.code, userId: user._id },
            session,
          );
        },
      );
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: VALIDATE_VERIFICATION_CODE })
  async validateVerificationCode(
    @Payload() data: { code: string; userId: string },
  ) {
    try {
      return withTransaction(
        this.connection,
        async (session: ITransactionSession) => {
          const user = await this.usersService.findById(data.userId, session);
          const isCodeValid = await this.verificationCodeService.exists({
            value: data.code,
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

  @MessagePattern({ cmd: LOGIN_USER_BY_EMAIL })
  async loginUserByEmail(@Payload() loginData: IUserCredentials) {
    const user = await this.usersService.findUser({ email: loginData.email });

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: USERS_SERVICE });
    }

    return plainToClass(CommonUserDTO, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @MessagePattern({ cmd: UPDATE_PROFILE })
  async updateProfile(
    @Payload() { userId, data }: { userId: string; data: IUpdateProfile },
  ) {
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
        const newBusinessCategories = await this.businessCategoriesService.find({
          query: { key: { $in: data.businessCategories } },
          session,
        });

        user.businessCategories =
          newBusinessCategories.map((category) => category._id) || [];
      }

      if ('languages' in data) {
        user.languages =
          (await this.languagesService.find(
              {
                query: { key: { $in: data.languages } },
                session
              }
          )) || [];
      }

      if ('socials' in data) {
        user.socials =
          (await this.usersService.createSocialsLinks(
            { userId, socials: data.socials },
            session,
          )) || [];
      }

      await user.save();

      await user.populate([
        'businessCategories',
        'languages',
        'socials',
        'profileAvatar',
      ]);

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UPDATE_PROFILE_AVATAR })
  async updateProfileAvatar(
    @Payload() { userId, data }: { userId: string; data: IUpdateProfileAvatar },
  ) {
    return withTransaction(this.connection, async (session) => {
      const storageHostName = await this.configService.get('storageHostname');
      const uploadBucket = await this.configService.get('uploadBucket');

      const uploadKey = data.profileAvatar.replace(
        `https://${storageHostName}/${uploadBucket}/`,
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

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: DELETE_PROFILE_AVATAR })
  async deleteProfileAvatar(@Payload() { userId }: { userId: string }) {
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

      return plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }
}
