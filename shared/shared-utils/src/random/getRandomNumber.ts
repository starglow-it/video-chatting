export const getRandomNumber = (maxNum: number, minNum: number = 0) =>
    Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);