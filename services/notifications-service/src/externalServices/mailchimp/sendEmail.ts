import Mailchimp, {
    MessageRecipient,
} from '@mailchimp/mailchimp_transactional';

import { SendEmailRequest } from '@shared/requests/sendEmail.request';
import { getConfigVar } from '../../services/config';
import { Readable } from 'stream';

let client: Mailchimp.ApiClient | null;

let apiKey: string | null = null;

const getOrCreateClient = async () => {
    if (!apiKey) {
        apiKey = await getConfigVar('mandrillApiKey');
    }

    if (client) return client;

    client = Mailchimp(apiKey!);

    return client;
};

export const sendEmail = async ({
    to,
    subject,
    html,
    template,
    icalEventContent,
}: SendEmailRequest) => {
    const emailClient = await getOrCreateClient();

    const smtpUser = await getConfigVar('smtpUser');
    const smtpUserName = await getConfigVar('smtpUserName');

    const sendTo: MessageRecipient[] = Array.isArray(to)
        ? to.map(({ email, name }) => ({ email, name, type: 'to' }))
        : [{ ...to, type: 'to' }];

    if (template?.key) {
        // @ts-ignore
        const templates = await emailClient.templates.list();

        // @ts-ignore
        const targetTemplate = templates.find((t) => t?.slug === template?.key);

        if (!targetTemplate) return;

        await emailClient.messages.sendTemplate({
            key: apiKey,
            template_name: targetTemplate.slug,
            template_content: [],
            inline_css: true,
            message: {
                subject: targetTemplate.name,
                from_email: smtpUser,
                from_name: smtpUserName,
                to: sendTo,
                merge_language: 'mailchimp',
                global_merge_vars: [
                    ...(template.data ?? []),
                    {
                        name: 'LIST_ADDRESS_HTML',
                        content: smtpUser,
                    },
                    {
                        name: 'COMPANY',
                        content: smtpUserName,
                    },
                    {
                        name: 'DESCRIPTION',
                        content: 'Video conference platform',
                    },
                ],
                // @ts-ignore
                attachments: icalEventContent
                    ? [
                          {
                              type: 'text/calendar; charset=utf-8; method=REQUEST; name="invite.ics";',
                              name: 'invite.ics',
                              // @ts-ignore
                              content: Readable.from(icalEventContent.data),
                          },
                      ]
                    : [],
            },
        });

        return;
    }

    await emailClient.messages.send({
        message: {
            from_email: smtpUser,
            from_name: smtpUserName,
            to: sendTo,
            html,
            subject,
        },
    });
};
