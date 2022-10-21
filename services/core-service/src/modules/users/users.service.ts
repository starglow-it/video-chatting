import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

// schemas
import { User, UserDocument } from '../../schemas/user.schema';

// shared
import { ICommonUserDTO } from 'shared';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { IUpdateProfile } from 'shared';

import {
  SocialLink,
  SocialLinkDocument,
} from '../../schemas/social-link.schema';
import {
  ProfileAvatar,
  ProfileAvatarDocument,
} from '../../schemas/profile-avatar.schema';
import { CustomPopulateOptions } from '../../types/custom';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>,
    @InjectModel(SocialLink.name)
    private social: Model<SocialLinkDocument>,
    @InjectModel(ProfileAvatar.name)
    private profileAvatar: Model<ProfileAvatarDocument>,
  ) {}

  async exists(query) {
    return this.user.exists(query);
  }

  async createUser(
    data: UpdateQuery<UserDocument>,
    session?: ITransactionSession,
  ): Promise<UserDocument> {
    data.password = await this.hashPassword(data.password);

    const [user] = await this.user.create([data], {
      session: session?.session,
    });

    return user;
  }

  async deleteUser(
    userId: string,
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.user.deleteOne({ _id: userId }, { session });

    return;
  }

  async findUser({
    query,
    session,
    populatePaths,
  }: {
    query: FilterQuery<UserDocument>;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }) {
    return this.user
      .findOne(
        query,
        {},
        { populate: populatePaths, session: session?.session },
      )
      .exec();
  }

  async updateUsers({
    query,
    data,
    populatePaths,
    session,
  }: {
    query: FilterQuery<UserDocument>;
    data: UpdateQuery<UserDocument>;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<any> {
    return this.user
      .updateMany(query, data, {
        session: session?.session,
        populate: populatePaths,
      })
      .exec();
  }

  async findUsers({
    query,
    populatePaths,
    session,
  }: {
    query: FilterQuery<UserDocument>;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }) {
    return this.user
      .find(query, {}, { populate: populatePaths, session: session?.session })
      .exec();
  }

  async findUserAndUpdate(
    query: FilterQuery<UserDocument>,
    data: UpdateQuery<UserDocument>,
    { session }: ITransactionSession,
  ) {
    return this.user.findOneAndUpdate(
      query,
      { $set: data },
      { session, new: true },
    );
  }

  async findByIdAndUpdate(
    id: ICommonUserDTO['id'],
    data: Partial<ICommonUserDTO>,
    session?: ITransactionSession,
  ) {
    return this.user.findByIdAndUpdate(
      id,
      { $set: data },
      { session: session?.session, new: true },
    );
  }

  async findById(
    id: ICommonUserDTO['id'],
    { session }: ITransactionSession,
    populatePaths?: CustomPopulateOptions,
  ) {
    return this.user
      .findById(id, {}, { session, populate: populatePaths })
      .exec();
  }

  async hashPassword(pass: string): Promise<string> {
    return bcrypt.hash(pass, 10);
  }

  async verifyPassword(
    passToVerify: string,
    passToCompare: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passToVerify, passToCompare);
  }

  async createSocialsLinks({ userId, socials }, { session }) {
    const newSocials = Object.entries(socials).map((socialEntry) => {
      return {
        user: userId,
        key: socialEntry[0],
        value: socialEntry[1],
      };
    });

    return this.social.create(newSocials, { session });
  }

  async createProfileAvatar(
    newProfileAvatar,
    { session }: ITransactionSession,
  ): Promise<ProfileAvatarDocument[]> {
    return this.profileAvatar.create([newProfileAvatar], { session });
  }

  async deleteProfileAvatar(
    profileAvatarId,
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.profileAvatar.deleteOne({ _id: profileAvatarId }, { session });

    return;
  }

  prepareUserUpdateData(
    data: Partial<IUpdateProfile>,
  ): Partial<ICommonUserDTO> {
    return {
      email: data.email,
      fullName: data.fullName,
      position: data.position,
      companyName: data.companyName,
      contactEmail: data.contactEmail,
      description: data.description,
      signBoard: data.signBoard,
      stripeAccountId: data.stripeAccountId,
      stripeSessionId: data.stripeSessionId,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      subscriptionPlanKey: data.subscriptionPlanKey,
      maxTemplatesNumber: data.maxTemplatesNumber,
      maxMeetingTime: data.maxMeetingTime,
      isSubscriptionActive: data.isSubscriptionActive,
      stripeEmail: data.stripeEmail,
      isStripeEnabled: data.isStripeEnabled,
      wasSuccessNotificationShown: data.wasSuccessNotificationShown,
    };
  }
}
