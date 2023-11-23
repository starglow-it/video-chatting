import { IBrokerHandler } from "../../../types/broker";
import { wrapMsgPayloadWithCatch } from "./wrapMsgPayloadWithCatch";
import { getConnection } from "./getConnection";

interface IArgs {
    queueName: string;
    prefetch: number;
    noAck?: boolean;
}

export const createConsumer = async (
    { queueName, prefetch, noAck }: IArgs,
    ...handlers: IBrokerHandler[]
): Promise<void> => {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.prefetch(prefetch, true);
    await channel.consume(
        queueName,
        wrapMsgPayloadWithCatch({
            handlers,
            channel,
            noAck,
        })
    );
};
