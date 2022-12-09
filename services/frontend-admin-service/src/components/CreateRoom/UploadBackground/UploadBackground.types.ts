export type UploadBackgroundProps = {
    isFileExists: boolean;
    onNextStep: () => void;
    isUploadDisabled?: boolean;
    onFileUploaded: (file: File) => void;
};
