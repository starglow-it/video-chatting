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
  console.log('connect', connection.id.toString());
  console.log('sessionStart', session.id);

  session.startTransaction();
  try {
    const res = await func({ session });
    console.log('session commit', session.id);

    await session.commitTransaction();
    return res;
  } catch (e) {
    console.log('abort');

    await session.abortTransaction();
    if (onRollback) {
      await onRollback(e);
    }

    if (onFinaly) {
      return onFinaly(e);
    }

    throw e;
  } finally {
    console.log('end session', session.id);
    await session.endSession();
  }
};
