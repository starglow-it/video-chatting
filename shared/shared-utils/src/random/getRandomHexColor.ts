import { getRandomNumber } from './getRandomNumber';

export const getRandomHexColor = (min = 0, max = 255) => {
    const maxNumber = max > 255 ? 255 : max;
    const minNumber = min < 0 ? 0 : min;

    const redNumber = getRandomNumber(maxNumber, minNumber);
    const greenNumber = getRandomNumber(maxNumber, minNumber);
    const blueNumber = getRandomNumber(maxNumber, minNumber);

    const redColor = `${redNumber.toString(16)}`.padEnd(2, '0');
    const greenColor = `${greenNumber.toString(16)}`.padEnd(2, '0');
    const blueColor = `${blueNumber.toString(16)}`.padEnd(2, '0');

    return `#${redColor}${greenColor}${blueColor}`;
};