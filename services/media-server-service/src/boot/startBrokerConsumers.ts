import { logger } from "../config/logger";
import { initConsumers } from "../broker";

export const startBrokerConsumers = async () => {
    logger.info("boot:broker:consumers:start");
    await initConsumers();
    logger.info("boot:broker:consumers:completed");
};
