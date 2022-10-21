import { logger } from '../config/logger';
import { initMediaServerExchange } from './media-server/consumer';

export const initConsumers = async () => {
    logger.info('broker:consumers:init:start');
    await initMediaServerExchange();
    logger.info('broker:consumers:init:complete');
};
