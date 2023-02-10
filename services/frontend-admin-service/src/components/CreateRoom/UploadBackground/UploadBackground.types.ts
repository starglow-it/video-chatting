export type UploadBackgroundProps = {
    isFileExists: boolean;
    onNextStep: () => void;
    isFileUploading?: boolean;
    onFileUploaded: (file: File) => void;
};
