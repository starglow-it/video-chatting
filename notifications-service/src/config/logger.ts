import * as winston from 'winston';

const transports: any[] = [];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format((info) => {
            // eslint-disable-next-line no-param-reassign
            info.message = `Log ${info.level} on notification: \n${info.message}`;
            return info;
        })(),
    ),
    transports,
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export { logger };
