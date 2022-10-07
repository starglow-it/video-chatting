export const parseBoolean = (
    str: string | undefined,
    def: boolean,
): boolean => {
    if (!str && str?.length === 0) {
        return def;
    }
    return ['true', '1'].includes(str as string);
};

export const isBoolean = (str: string) => {
    return ['true', '1', '0', 'false'].includes(str as string);
};
