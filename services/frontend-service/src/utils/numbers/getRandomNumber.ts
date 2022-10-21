export const getRandomNumber = (maxNum: number, minNum: number = 0) =>
    Math.floor(minNum + Math.random() * (maxNum - minNum));
