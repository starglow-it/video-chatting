import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// schemas
import { UserToken, UserTokenDocument } from '../../schemas/user-token.schema';
import { UserDocument } from '../../schemas/user.schema';

// shared
import { TokenPayloadType } from '@shared/types/token-payload.type';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../../types/custom';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel(UserToken.name) private userToken: Model<UserTokenDocument>,
  ) {}

  async createToken(
    {
      user,
      token,
    }: {
      user: UserDocument['id'];
      token: TokenPayloadType;
    },
    { session }: ITransactionSession,
  ): Promise<UserTokenDocument> {
    const tokenDoc = {
      token: token.token,
      expiresAt: token.expiresAt,
      type: token.type,
      user,
    };

    const [newToken] = await this.userToken.create([tokenDoc], { session });

    return newToken;
  }

  async find(query: FilterQuery<UserTokenDocument>) {
    return this.userToken.find(query);
  }

  async findOne({
    query,
    session,
    populatePath,
  }: {
    query: FilterQuery<UserTokenDocument>;
    session: ITransactionSession;
    populatePath?: CustomPopulateOptions;
  }) {
    return this.userToken
      .findOne(query, {}, { populate: populatePath, session: session?.session })
      .exec();
  }

  async deleteToken(data: { token: string }, { session }: ITransactionSession) {
    return this.userToken.deleteOne({ token: data.token }, { session });
  }

  async deleteManyTokens(
    query: FilterQuery<UserTokenDocument>,
    { session }: ITransactionSession,
  ) {
    return this.userToken.deleteMany(query, { session });
  }

  async exists(token: string) {
    return this.userToken.exists({ token });
  }

  async deleteUserTokens(
    { userId }: { userId: UserDocument['_id'] },
    { session }: ITransactionSession,
  ) {
    return this.userToken.deleteMany({ user: userId }, { session });
  }
}
