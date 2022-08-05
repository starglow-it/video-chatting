import process from 'process';
import { Channel, Connection } from 'amqplib';
import { logger } from '../../config/logger';

interface IArgs {
    connection: Connection,
}

export const createChannel = async ({ connection }: IArgs): Promise<Channel> => {
    const channel = await connection.createChannel();
    channel.on('error', (e) => {
        logger.error(`Error; Broker.createChannel; ${e.message}`);
        process.exit();
    });
    return channel;
};
