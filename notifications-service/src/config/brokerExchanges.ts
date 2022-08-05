import { IExchange } from '../../types/broker';

export const NOTIFICATION_EXCHANGE = Object.freeze({
    name: 'notification',
    type: 'direct',
    options: {
        durable: true,
    },
    queues: {
        EMAIL_SEND: {
            name: 'rabbitMqNotificationsQueue',
            binding: 'rabbitMqNotificationsQueue',
            options: {
                durable: false,
            },
        },
    },
}) as IExchange;
