import { logger } from '../config/logger';
import { startBroker } from './startBroker';
import { startBrokerConsumers } from './startBrokerConsumers';
import { startLiveKitServer } from './startLiveKitServer';

export const runBootTasks = async () => {
    logger.info('BootTasks:running:start');
    await startBroker();
    await startBrokerConsumers();
    await startLiveKitServer();
    logger.info('BootTasks:running:complete');
};
