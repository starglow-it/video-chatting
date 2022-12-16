export type TemplateSoundProps = {
    fileName?: string;
    src: string;
    isUploadDisabled: boolean;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onFileUploaded: (file: File) => void;
    onRemove: () => void;
}