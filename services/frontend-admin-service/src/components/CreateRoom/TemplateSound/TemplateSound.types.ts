export type TemplateSoundProps = {
    fileName?: string;
    src: string;
    isLoading: boolean;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onFileUploaded: (file: File) => void;
    onRemove: () => void;
};
