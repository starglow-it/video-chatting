import { ITemplateLink } from "shared-types";

export type TemplateLinkItemProps = {
    index: number;
    data: ITemplateLink;
    isStatic?: boolean;
    isDraggable?: boolean;
    onRemove?: (index: number) => void;
    onAccept?: (index: number) => void;
}

export type TemplatesLinksProps = {
    links: ITemplateLink[];
    onNextStep: () => void;
    onPreviousStep: () => void;
    onRemoveLink: (index: number) => void;
};