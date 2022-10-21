interface IBrokerHandlerArgs {
    payload: {
        pattern: any;
        data: any;
    };
}

export type IBrokerHandler = (
    args: IBrokerHandlerArgs
) => Promise<{ result: string; acked?: boolean }>;

export interface IQueue {
    name: string;
    binding: string;
    options: Record<string, any>;
}

export interface IExchange {
    name: string;
    type: "direct" | "fanout" | "topic" | "headers" | "match";
    options: {
        durable: boolean;
    };
    queues: Record<string, IQueue>;
}
