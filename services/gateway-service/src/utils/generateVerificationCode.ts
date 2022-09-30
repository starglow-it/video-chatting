import { generateRandomNumberInRange } from './generateRandomNumberInRange';

const generateWithRecursion = (wholeStringNumber, numberOfDigitsLeft) => {
  if (!numberOfDigitsLeft) return wholeStringNumber;

  const randomDigit = generateRandomNumberInRange(0, 9);

  return `${wholeStringNumber}${randomDigit}${generateWithRecursion(
    wholeStringNumber,
    numberOfDigitsLeft - 1,
  )}`;
};

export const generateVerificationCode = (numberOfDigits) => {
  return generateWithRecursion('', numberOfDigits);
};
