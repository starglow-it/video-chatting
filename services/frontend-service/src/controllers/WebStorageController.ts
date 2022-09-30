export enum StorageKeysEnum {
    templateId = 'templateId',
    meetingSettings = 'meetingSettings',
}

export const WebStorage = {
    save({ key, data }: { key: StorageKeysEnum; data: unknown }) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    get<DataType>({ key }: { key: StorageKeysEnum }): DataType {
        const storageData = localStorage.getItem(key) || '{}';

        return JSON.parse(storageData);
    },
    delete({ key }: { key: string }) {
        localStorage.removeItem(key);
    },
};
