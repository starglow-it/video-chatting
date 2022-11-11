export const getRandomNumber = (maxNum: number, minNum = 0) =>
  Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
