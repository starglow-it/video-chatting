import { vars } from './vars';

const { rabbit: { user, host, pass } } = vars;

export const brokerConfig = Object.freeze({
    url: `amqp://${user}:${pass}@${host}`,
});
