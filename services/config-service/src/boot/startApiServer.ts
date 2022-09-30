import { logger } from '../config/logger';
import { envConfig } from '../config/vars';
import { app } from '../config/express';

const { port, nodeEnv } = envConfig;

export const startApiServer = () => {
    app.listen(port, () => {
        logger.warn(`Core started on port ${port} (${nodeEnv})`);
    });
};
