export const roundNumberToPrecision = (
  num: number,
  precision: number,
): number => {
  const precisionOffset = 10 ** precision;

  return Math.round((num + Number.EPSILON) * precisionOffset) / precisionOffset;
};
