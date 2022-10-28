export type SignOptionProps = {
    data: {
        id: number;
        type: string;
        label: string;
        value: string;
    }[];
    width: number;
    height: number;
    formKey: string;
    openBoardsType: string;
    onOpenBoardsType: (value: string) => void;
};

export type ChooseSignBoardProps = {
    optionWidth: number;
    optionHeight: number;
    formKey: string;
};
