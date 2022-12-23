export const adjustUserPositions = <Type extends { top: number, left: number }>(participantsPositions: Type[]) =>
    participantsPositions.map(({ top, left }) => ({
        left,
        bottom: (1 - top),
    }));

export const adjustLinkPositions = <Type extends { top: number }>(linkPositions: Type[]): (Omit<Type, 'top'> & { bottom: number })[] => {
    return linkPositions.map(({ top, ...data }) => ({
        ...data,
        bottom: (1 - top),
    }));
}

