import { getConnection } from "../utils/broker/getConnection";
import { initExchanges } from "../utils/broker/initExchanges";

export const startBroker = async () => {
    const connection = await getConnection();
    await initExchanges({ connection });
};
