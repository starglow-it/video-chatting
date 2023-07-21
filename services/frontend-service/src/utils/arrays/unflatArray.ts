export const unflatArray = <Entity>(
    array: Entity[],
    arrSize: number,
): Entity[][] => {
    if (!array) return [];

    const newArr = [];
    const newLen = array.length / arrSize;

    for (let i = 0; i < newLen; i++) {
        const group = [];
        for (let j = 0; j < arrSize; j++) {
            if (array[i * arrSize + j]) {
                group.push(array[i * arrSize + j]);
            }
        }
        newArr.push(group);
    }

    return newArr;
};
