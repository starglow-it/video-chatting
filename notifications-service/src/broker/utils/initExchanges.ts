import { Connection } from 'amqplib';
import * as exchangesList from '../../config/brokerExchanges';
import { createChannel } from './createChannel';
import { createExchange } from './createExchange';

interface IArgs {
    connection: Connection;
}

export const initExchanges = async ({ connection }: IArgs): Promise<void> => {
    const channel = await createChannel({ connection });
    const exchanges = Object.values(exchangesList);

    await Promise.all(
        exchanges.map((exchange) =>
            createExchange({
                channel,
                exchange,
            }),
        ),
    );
    await channel.close();
};
