import process from 'process';
import amqp, { Connection } from 'amqplib';
import { logger } from '../../config/logger';
import { brokerConfig } from '../../config/broker';

export const createConnection = async (): Promise<Connection> => {
    const connection = await amqp.connect(brokerConfig.url);
    connection.on('error', (e) => {
        logger.error('Error; Broker.createConnection;', e.message);
        process.exit();
    });
    connection.on('blocked', (reason) => {
        logger.error(
            `Error; Broker.createConnection; Rabbit connection block by ${reason}`,
        );
        process.exit();
    });
    return connection;
};
