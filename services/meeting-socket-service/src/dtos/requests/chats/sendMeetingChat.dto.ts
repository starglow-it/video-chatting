import { ZodRawShape, ZodString, z } from 'zod';
type SendMeetingChatZod = {
  content: ZodString;
};

export const SendMeetingChatRequestDto = z.object<SendMeetingChatZod>({
  content: z.string(),
});

export type SendMeetingChatZodPayload = z.infer<
  typeof SendMeetingChatRequestDto
>;
