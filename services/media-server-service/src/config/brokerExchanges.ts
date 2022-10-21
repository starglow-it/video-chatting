import { IExchange } from '../../types/broker';

export const MEDIA_SERVER_EXCHANGE = Object.freeze({
    name: 'media-server',
    type: 'direct',
    options: {
        durable: true,
    },
    queues: {
        GET_TOKEN: {
            name: 'rabbitMqMediaServerQueue',
            binding: 'rabbitMqMediaServerQueue',
            options: {
                durable: false,
            },
        },
    },
}) as IExchange;
