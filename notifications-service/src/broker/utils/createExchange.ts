import { Channel } from 'amqplib';
import { IExchange } from '../../../types/broker';
import { createQueue } from './createQueue';

export interface IArgs {
    exchange: IExchange;
    channel: Channel;
}

export const createExchange = async ({ channel, exchange }: IArgs): Promise<void> => {
    await channel.assertExchange(exchange.name, exchange.type, exchange.options);
    const queues = Object.values(exchange.queues);

    await Promise.all(
        queues.map(async (queue) => (
            createQueue({
                channel,
                queue,
                exchangeName: exchange.name,
            })
        )),
    );
};
