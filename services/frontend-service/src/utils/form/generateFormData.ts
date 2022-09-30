const appendFormData = (data: any, formData: FormData, root: string) => {
    if (data instanceof File) {
        formData.append(root, data);
    } else if (Array.isArray(data)) {
        data.forEach((value, i) => {
            appendFormData(value, formData, `${root}[${i}]`);
        });
    } else if (typeof data === 'object' && data) {
        Object.keys(data).forEach(k => {
            const key = root.length ? `${root}[${k}]` : k;
            if (data[k] instanceof FileList) {
                const value = [...data[k]];
                value.forEach(v => {
                    formData.append(key, v);
                });
            } else {
                appendFormData(data[k], formData, key);
            }
        });
    } else if (data !== null && data !== undefined) {
        formData.append(root, data);
    }
};

export const generateFormData = (obj: any) => {
    const formData = new FormData();

    appendFormData(obj, formData, '');

    return formData;
};
