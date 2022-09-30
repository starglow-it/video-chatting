import { ConfigKeysType } from "@shared/interfaces/config.interface";
import { sendHttpRequest } from "../../utils/http/sendHttpRequest";

export const getConfigVar = async (key: ConfigKeysType): Promise<any> => {
    const response = await sendHttpRequest({
        url: `http://config-service:4000/v1/config/${key}`,
        method: "GET",
    });

    return response.data.success;
};

export const getAllConfigVars = async (): Promise<any> => {
    const response = await sendHttpRequest({
        url: "http://config-service:4000/v1/config",
        method: "GET",
    });

    return response.data.success;
};
