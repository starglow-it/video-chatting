export const senderScheduleMessage = ({
  fullName,
  templateName,
  startAt,
  endAt,
}: {
  fullName: string;
  templateName: string;
  startAt: string;
  endAt: string;
}): string => `
        You have scheduled meeting with ${fullName}. \n Template name ${templateName}
Starts: ${startAt}
Ends: ${endAt}
`;
