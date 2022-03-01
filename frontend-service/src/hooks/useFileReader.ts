import { useCallback, useMemo } from 'react';

export const useFileReader = () => {
    const handleFileAvailable = useCallback((file: File): Promise<string> => {
        return new Promise(res => {
            const reader = new FileReader();

            reader.addEventListener(
                'load',
                () => {
                    res(reader.result);
                },
                false,
            );

            if (file) {
                reader.readAsDataURL(file);
            }
        });
    }, []);

    return useMemo(
        () => ({
            onFileAvailable: handleFileAvailable,
        }),
        [handleFileAvailable],
    );
};
