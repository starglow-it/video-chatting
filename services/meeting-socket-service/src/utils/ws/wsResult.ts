export const wsResult = (data?: unknown) => ({ success: true, ...(data && {result: data}) });
