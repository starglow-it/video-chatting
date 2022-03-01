export const padArray = <ArrayElement>(
    arr: ArrayElement[],
    padLength: number,
): Array<ArrayElement | undefined> => Array.from({ ...arr, length: padLength });
