import { ClientSession, Connection } from 'mongoose';

export interface IWithTransactionOptions {
  onRollback?: CallableFunction;
}

export interface ITransactionSession {
  session: ClientSession;
}

export const withTransaction = async <T>(
  connection: Connection,
  func: (session: ITransactionSession) => Promise<T>,
  { onRollback }: IWithTransactionOptions = {},
) => {
  const session = await connection.startSession();

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
