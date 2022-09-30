/**
 * Accepts object with nested properties and return number of true values
 * @param acc number
 * @param b object
 */
export const reduceValuesNumber = (
    acc: number,
    b: boolean | { [key: string]: boolean },
): number => {
    if (b === true) {
        return acc + 1;
    }
    if (b && typeof b === 'object') {
        return acc + Object.values(b).reduce(reduceValuesNumber, 0);
    }
    return acc;
};
