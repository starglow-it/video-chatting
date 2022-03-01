export enum StorageKeysEnum {
    templateId = 'templateId',
}

class WebStorageController {
    save({ key, data }: { key: StorageKeysEnum; data: any }) {
        localStorage.setItem(key, data);
    }

    get({ key }: { key: StorageKeysEnum }): string | null {
        return localStorage.getItem(key);
    }

    delete({ key }: { key: string }) {
        localStorage.removeItem(key);
    }
}

export const WebStorage = new WebStorageController();
