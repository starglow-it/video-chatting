export const getRandomNumber = (maxNum: number): number =>
  Math.floor(Math.random() * maxNum);

export const getRandomHexColor = () => {
  const redNumber = `${getRandomNumber(255)}`;
  const greenNumber = `${getRandomNumber(255)}`;
  const blueNumber = `${getRandomNumber(255)}`;

  const redColor = `${parseInt(redNumber, 16)}`.padEnd(2, '0');
  const greenColor = `${parseInt(greenNumber, 16)}`.padEnd(2, '0');
  const blueColor = `${parseInt(blueNumber, 16)}`.padEnd(2, '0');

  return `#${redColor}${greenColor}${blueColor}`;
};
