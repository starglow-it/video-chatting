import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

// schemas
import { User, UserDocument } from '../../schemas/user.schema';

// shared
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { ICommonUser, IUpdateProfile, PlanKeys } from 'shared-types';

import {
  SocialLink,
  SocialLinkDocument,
} from '../../schemas/social-link.schema';

import {
  CustomPopulateOptions,
  GetModelMultipleQuery,
  GetModelSingleQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';
import {
  ProfileAvatar,
  ProfileAvatarDocument,
} from '../../schemas/profile-avatar.schema';

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
  }: GetModelSingleQuery<UserDocument>) {
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
  }: UpdateModelMultipleQuery<UserDocument>): Promise<any> {
    return this.user
      .updateMany(query, data, {
        session: session?.session,
        populate: populatePaths,
      })
      .exec();
  }

  async findUsers({
    query,
    options,
    populatePaths,
    session,
  }: GetModelMultipleQuery<UserDocument>) {
    return this.user
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          sort: options?.sort,
          populate: populatePaths,
          session: session?.session,
        },
      )
      .exec();
  }

  async findUserAndUpdate({
    query,
    data,
    session,
  }: UpdateModelSingleQuery<UserDocument>) {
    return this.user.findOneAndUpdate(
      query,
      { $set: data },
      { session: session?.session, new: true },
    );
  }

  async findByIdAndUpdate(
    id: ICommonUser['id'],
    data: Partial<ICommonUser>,
    session?: ITransactionSession,
  ) {
    return this.user
      .findByIdAndUpdate(
        id,
        { $set: data },
        { session: session?.session, new: true },
      )
      .exec();
  }

  async findById(
    id: ICommonUser['id'],
    session: ITransactionSession,
    populatePaths?: CustomPopulateOptions,
  ) {
    return this.user
      .findById(id, {}, { session: session?.session, populate: populatePaths })
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

  async count({
    query,
    session,
  }: GetModelSingleQuery<UserDocument>): Promise<number> {
    return this.user
      .countDocuments(query, { session: session?.session })
      .exec();
  }

  prepareUserUpdateData(data: Partial<IUpdateProfile>): Partial<ICommonUser> {
    const isHandleTimeLimit = ![
      PlanKeys.Business,
      PlanKeys.House,
      PlanKeys.Professional,
    ].includes(data.subscriptionPlanKey);
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
      stripeSeatSubscriptionId: data.stripeSeatSubscriptionId,
      subscriptionPlanKey: data.subscriptionPlanKey,
      nextSubscriptionPlanKey: data.nextSubscriptionPlanKey,
      prevSubscriptionPlanKey: data.prevSubscriptionPlanKey,
      maxTemplatesNumber: data.maxTemplatesNumber,
      maxMeetingTime:
        !isHandleTimeLimit && data.maxMeetingTime === 0
          ? null
          : data.maxMeetingTime,
      isSubscriptionActive: data.isSubscriptionActive,
      stripeEmail: data.stripeEmail,
      isStripeEnabled: data.isStripeEnabled,
      wasSuccessNotificationShown: data.wasSuccessNotificationShown,
      shouldShowTrialExpiredNotification:
        data.shouldShowTrialExpiredNotification,
      isDowngradeMessageShown: data.isDowngradeMessageShown,
      country: data.country,
      registerTemplate: data.registerTemplate,
      teamMembers: data.teamMembers,
      maxSeatNumForTeamMembers: data.maxSeatNumForTeamMembers
    };
  }
}
