export const urlBuilder = (url: URL, path: string, params?: Record<string, number | boolean | string>): string => {
    const urlInstance = new URL(path, url);

    if (params && typeof params === 'object') {
        Object.entries(params).forEach(entry => {
            const value = entry[1].toString();

            urlInstance.searchParams.append(entry[0], value);
        });
    }

    return urlInstance.href;
}