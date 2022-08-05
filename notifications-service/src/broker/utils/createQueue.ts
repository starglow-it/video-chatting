import { Channel } from 'amqplib';
import { IQueue } from '../../../types/broker';

export interface IArgs {
    exchangeName: string;
    queue: IQueue;
    channel: Channel;
}

export const createQueue = async ({ channel, exchangeName, queue }: IArgs): Promise<void> => {
    await channel.assertQueue(queue.name, queue.options);
    await channel.bindQueue(queue.name, exchangeName, queue.binding);
};
