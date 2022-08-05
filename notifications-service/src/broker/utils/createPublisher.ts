import { Channel } from 'amqplib';
import { IQueue } from '../../../types/broker';
import { objectToJsonBuffer } from '../../utils/object/objectToJsonBuffer';
import { getConnection } from './getConnection';

let channelPromise: Promise<Channel>;

interface IGlobalArgs {
    exchangeName: string;
    queue: IQueue;
    expirationInMs?: number;
    persistent?: boolean;
}

interface IArgs {
    expirationInMs?: number;
    persistent?: boolean;
}

export const createPublisher = ({
    exchangeName,
    queue,
    expirationInMs: dExpirationInMs,
    persistent: dPersistent = true,
}: IGlobalArgs) => async (data: any = {}, {
    persistent = dPersistent,
    expirationInMs = dExpirationInMs,
}: IArgs = {}): Promise<void> => {
    const connection = await getConnection();
    if (!channelPromise) {
        // @ts-ignore
        channelPromise = connection.createChannel();
    }
    const channel = await channelPromise;
    const payload = objectToJsonBuffer(data);

    channel.publish(
        exchangeName,
        queue.binding,
        payload,
        { persistent, expiration: expirationInMs },
    );
};
