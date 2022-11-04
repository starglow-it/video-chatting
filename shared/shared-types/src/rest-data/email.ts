export type SendEmailRequest = {
    to: { email: string; name: string; }[] | { email: string; name: string; };
    subject: string;
    html?: string;
    icalEventLink?: string;
    icalEventContent?: string;
    template?: {
        key: string;
        data: { name: string; content: string }[]
    };
}