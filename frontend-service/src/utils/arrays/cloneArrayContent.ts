export const cloneArrayContent = <ArrayElement>(
    array: ArrayElement[],
    numberToFill: number,
): ArrayElement[] => {
    const newArray = [...array];

    newArray.length = numberToFill;

    newArray.fill(false, array.length, numberToFill);

    return newArray.map((element, index) => {
        if (element) return element;
        return array[(index + 1) % array.length];
    });
};
