import * as controller from "./controller";
import { createConsumer } from "../../utils/broker/createConsumer";
import { MEDIA_SERVER_EXCHANGE } from "../../config/brokerExchanges";

export const initMediaServerExchange = () =>
    Promise.all([
        createConsumer(
            {
                queueName: MEDIA_SERVER_EXCHANGE.queues.GET_TOKEN.name,
                prefetch: 50,
            },
            controller.consumeGetToken
        ),
    ]);
