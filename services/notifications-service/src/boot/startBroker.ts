import { getConnection } from '../broker/utils/getConnection';
import { initExchanges } from '../broker/utils/initExchanges';
import { logger } from '../config/logger';

export const startBroker = async () => {
    logger.info('boot:broker:start');
    const connection = await getConnection();
    await initExchanges({ connection });
    logger.info('boot:broker:completed');
};
