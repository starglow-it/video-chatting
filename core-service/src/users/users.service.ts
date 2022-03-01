import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

// schemas
import { User, UserDocument } from '../schemas/user.schema';

// shared
import { IUserCredentials } from '@shared/types/registerUser.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { IUpdateProfile } from '@shared/interfaces/update-profile.interface';

import { SocialLink, SocialLinkDocument } from '../schemas/social-link.schema';
import {
  ProfileAvatar,
  ProfileAvatarDocument,
} from '../schemas/profile-avatar.schema';

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

  async exists(query): Promise<boolean> {
    return this.user.exists(query);
  }

  async createUser(
    data: IUserCredentials,
    { session }: ITransactionSession,
  ): Promise<UserDocument> {
    const [user] = await this.user.create([data], { session });

    return user;
  }

  async findUser(query: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.user.findOne(query);
  }

  async findUsers({
    query,
    populatePaths,
    session,
  }: {
    query: FilterQuery<UserDocument>;
    session?: ITransactionSession;
    populatePaths?: string | string[] | PopulateOptions | PopulateOptions[];
  }): Promise<UserDocument[]> {
    return this.user.find(
      query,
      {},
      { populate: populatePaths, session: session?.session },
    );
  }

  async findUserAndUpdate(
    query: FilterQuery<UserDocument>,
    data: Partial<ICommonUserDTO>,
    { session }: ITransactionSession,
  ): Promise<UserDocument> {
    return this.user.findOneAndUpdate(
      query,
      { $set: data },
      { session, new: true },
    );
  }

  async findByIdAndUpdate(
    id: ICommonUserDTO['id'],
    data: Partial<ICommonUserDTO>,
    { session }: ITransactionSession,
  ): Promise<UserDocument> {
    return this.user.findByIdAndUpdate(
      id,
      { $set: data },
      { session, new: true },
    );
  }

  async findById(
    id: ICommonUserDTO['id'],
    { session }: ITransactionSession,
  ): Promise<UserDocument> {
    return this.user.findById(id, {}, { session });
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

  async deleteProfileAvatar(profileAvatarId, { session }: ITransactionSession) {
    return this.profileAvatar.deleteOne({ _id: profileAvatarId }, { session });
  }

  prepareUserUpdateData(data: IUpdateProfile): Partial<ICommonUserDTO> {
    return {
      email: data.email,
      fullName: data.fullName,
      position: data.position,
      companyName: data.companyName,
      contactEmail: data.contactEmail,
      description: data.description,
    };
  }
}
