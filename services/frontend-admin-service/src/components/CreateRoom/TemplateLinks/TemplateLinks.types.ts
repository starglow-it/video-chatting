export type LinkItemData = {
    id: string;
    key: string;
    top: number;
    left: number;
}

export type TemplateLinkItemProps = {
    index: number;
    isDraggable: boolean;
    isStatic: boolean;
    data: LinkItemData;
    onPositionChange: (data: { id: string; left: number; top: number }) => void;
    onRemove: (index: number) => void;
    onAccept: (index: number) => void;
}

export type TemplatesLinksProps = {
    links: LinkItemData[];
    onNextStep: () => void;
    onPreviousStep: () => void;
    onRemoveLink: (index: number) => void;
};