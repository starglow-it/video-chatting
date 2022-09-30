import { logger } from '../config/logger';
import { startBroker } from './startBroker';
import { startBrokerConsumers } from './startBrokerConsumers';

export const runBootTasks = async () => {
    logger.info('BootTasks:running:start');
    await startBroker();
    await startBrokerConsumers();
    logger.info('BootTasks:running:complete');
};
