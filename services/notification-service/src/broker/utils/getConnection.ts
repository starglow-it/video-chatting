import { Connection } from 'amqplib';
import { createConnection } from './createConnection';
import { logger } from '../../config/logger';

let connectionState: Promise<Connection>;

export const getConnection = (): Promise<Connection> => {
    if (!connectionState) {
        logger.info('broker:connecting:start');
        connectionState = createConnection();
        logger.info('broker:connecting:complete');
    }
    return connectionState;
};
