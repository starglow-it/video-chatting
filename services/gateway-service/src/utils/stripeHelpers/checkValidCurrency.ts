import { BadRequestException } from "@nestjs/common";
import { sendHttpRequest } from "../http/sendHttpRequest"
import { AxiosPromise } from "axios";
type Args = {
    amount: number;
    currency: string;
}

type Currency = {
    new_amount: number;
    new_currency: string;
    old_currency: string;
    old_amount: number;
}

const convertCurrency = async (have: string, amount: number, want: string = 'USD') => (await (sendHttpRequest({
    url: `https://api.api-ninjas.com/v1/convertcurrency?have=${have.toUpperCase()}&want=${want}&amount=${amount}`,
    method: 'GET',
    headers: {
        'X-Api-Key': 'el3nBqSWmVPhddtK5sbcMw==9NZWj14SaZD1XdBg'
    }
}) as AxiosPromise<Currency>)).data;

export const checkValidCurrency = async ({ amount, currency }: Args): Promise<void> => {
    try {
        if(!amount || !currency) return;
        const c = await convertCurrency(currency, amount);
        const {new_amount} = await convertCurrency('USD', 0.5, currency);
        if (c.new_amount <= 0.5) {
            throw new BadRequestException(`Invalid amount, please enter amount > ${new_amount}`);
        }
        return;
    }
    catch (err) {
        throw new BadRequestException(err);
    }
}