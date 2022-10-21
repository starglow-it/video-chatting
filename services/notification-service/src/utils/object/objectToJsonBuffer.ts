export const objectToJsonBuffer = (object: Record<string, any>) => {
    const jsonObject = JSON.stringify(object);
    return Buffer.from(jsonObject);
};
