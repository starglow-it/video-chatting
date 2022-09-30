import { logger } from '../config/logger';
import { startApiServer } from './startApiServer';

export const runBootTasks = async () => {
    logger.info('BootTasks:running:start');
    await startApiServer();
    logger.info('BootTasks:running:complete');
};
