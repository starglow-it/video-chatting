import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  VerificationCode,
  VerificationCodeDocument,
} from '../../schemas/verification-code.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectModel(VerificationCode.name)
    private verificationCode: Model<VerificationCodeDocument>,
  ) {}

  async createUserCode(
    { code, userId }: { userId: string; code: string },
    { session }: ITransactionSession,
  ) {
    return this.verificationCode.create(
      [
        {
          value: code,
          user: userId,
        },
      ],
      { session },
    );
  }

  async deleteUserCode(
    { userId }: FilterQuery<VerificationCodeDocument>,
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.verificationCode.deleteMany({ user: userId }, { session });

    return;
  }

  async exists({ userId, value }: FilterQuery<VerificationCodeDocument>) {
    return this.verificationCode.exists({ user: userId, value });
  }
}
