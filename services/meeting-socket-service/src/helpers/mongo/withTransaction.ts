import { ClientSession, Connection } from 'mongoose';
import { ReadPreference } from 'mongodb';

export interface IWithTransactionOptions {
  onRollback?: CallableFunction;
}

export interface ITransactionSession {
  session: ClientSession;
}

export const withTransaction = async (
  connection: Connection,
  func: CallableFunction,
  { onRollback }: IWithTransactionOptions = {},
) => {
  const session = await connection.startSession({
    defaultTransactionOptions: {
      readPreference: ReadPreference.primary,
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });

  session.startTransaction();
  try {
    const res = await func({ session });
    await session.commitTransaction();
    return res;
  } catch (e) {
    await session.abortTransaction();
    if (onRollback) {
      await onRollback();
    }
    throw e;
  } finally {
    await session.endSession();
  }
};
