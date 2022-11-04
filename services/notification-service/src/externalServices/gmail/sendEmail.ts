import nodemailer, { Transporter } from 'nodemailer';

import { SendEmailRequest } from 'shared-types';
import { getAllConfigVars, getConfigVar } from '../../services/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let transport: Transporter<SMTPTransport.SentMessageInfo> | null = null;

const getOrCreateTransport = async () => {
    if (transport) return transport;

    const { smtpUser, smtpPass } = await getAllConfigVars();

    transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    return transport;
};

export const sendEmail = async ({
    to,
    subject,
    html,
    icalEventLink,
}: SendEmailRequest) => {
    try {
        const transportClient = await getOrCreateTransport();

        const smtpUser = await getConfigVar('smtpUser');

        await transportClient.sendMail({
            from: smtpUser,
            to: Array.isArray(to) ? to.map(({ email }) => email) : to.email,
            subject,
            html,
            icalEvent: icalEventLink,
        });
    } catch (e) {
        console.log(e);
    }
};
