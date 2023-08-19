export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (maxRetries <= 0) {
      console.log(err);
      return;
    }
    return await retry(fn, maxRetries - 1);
  }
};
