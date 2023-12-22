import { ClientSession, Connection } from 'mongoose';

export interface IWithTransactionOptions {
  onRollback?: CallableFunction;
  onFinaly?: CallableFunction;
}

export interface ITransactionSession {
  session: ClientSession;
}

export const withTransaction = async <T>(
  connection: Connection,
  func: (session: ITransactionSession) => Promise<T>,
  { onRollback, onFinaly }: IWithTransactionOptions = {},
) => {
  const session = await connection.startSession({});
  session.startTransaction();
  try {
    const res = await func({ session });

    await session.commitTransaction();
    return res;
  } catch (e) {
    await session.abortTransaction();
    if (onRollback) {
      await onRollback(e);
    }

    if (onFinaly) {
      return onFinaly(e);
    }

    throw e;
  } finally {
    await session.endSession();
  }
};
