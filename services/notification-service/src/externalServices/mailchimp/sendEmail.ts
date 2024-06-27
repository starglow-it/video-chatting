import Mailchimp, {
    MessageRecipient,
    MessagesSendTemplateRequest,
} from '@mailchimp/mailchimp_transactional';

import { SendEmailRequest } from 'shared-types';
import { getConfigVar } from '../../services/config';

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
    attachmentContent
}: SendEmailRequest): Promise<any> => {
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

        let buff = Buffer.from(icalEventContent ?? '');
        let content = buff.toString('base64');

        const sendTemplateData: MessagesSendTemplateRequest = {
            template_name: targetTemplate.slug,
            template_content: [],
            message: {
                subject: targetTemplate.name,
                from_email: targetTemplate.from_email || 'mailchimp@theliveoffice.com',
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
                attachments: icalEventContent
                    ? [
                          {
                              type: 'text/calendar; charset=utf-8; method=REQUEST; name="invite.ics";',
                              name: 'invite.ics',
                              // @ts-ignore
                              content,
                          },
                      ]
                    : (attachmentContent
                        ? [
                            {
                                type: 'text/plain',
                                name: 'Meeting Summary and Transcript.txt',
                                content: Buffer.from(attachmentContent).toString('base64')
                            }
                        ]
                        : [] ),
            },
        };

        const s = await emailClient.messages.sendTemplate(sendTemplateData);
        return s;
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
