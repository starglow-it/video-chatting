import { logger } from '../config/logger';
import { initNotificationsExchange } from './notification/consumer';

export const initConsumers = async () => {
    logger.info('broker:consumers:init:start');
    await initNotificationsExchange();
    logger.info('broker:consumers:init:complete');
};
