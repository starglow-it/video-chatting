import * as dotenv from "dotenv";
import { parseString } from "../utils/parsers/parseString";

dotenv.config();

export const vars = Object.freeze({
    rabbit: {
        user: parseString(process.env.RABBIT_USER, "rabbituser"),
        pass: parseString(process.env.RABBIT_PASS, "rabbitpass"),
        host: parseString(process.env.RABBIT_HOST, "rabbitmq"),
    },
});
