import { NOTIFICATION_EXCHANGE } from '../../config/brokerExchanges';
import { createConsumer } from '../utils/createConsumer';
import * as controller from './controller';

export const initNotificationsExchange = () => Promise.all([
    createConsumer(
        {
            queueName: NOTIFICATION_EXCHANGE.queues.EMAIL_SEND.name,
            prefetch: 50,
        },
        controller.consumeEmailSend,
    ),
]);
