export const addZero = (number: number): string =>
    number < 10 ? `0${number}` : `${number}`;
