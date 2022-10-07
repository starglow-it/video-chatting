export const parseNumber = (str: string | undefined, def: number): number => {
    const num = Number(str) || def;
    return Number.isNaN(num) ? def : num;
};

export const isNumber = (str) => {
    const num = Number(str);

    return !Number.isNaN(num);
};
