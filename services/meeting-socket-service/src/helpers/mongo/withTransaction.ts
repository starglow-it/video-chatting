import { ClientSession, Connection } from 'mongoose';
import { WsError } from 'src/utils/ws/wsError';

export interface IWithTransactionOptions {
  onRollback?: CallableFunction;
}

export interface ITransactionSession {
  session: ClientSession;
}

export const withTransaction = async (
  connection: Connection,
  func: CallableFunction & ((session: ITransactionSession) => any),
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
