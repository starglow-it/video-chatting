export const adjustUserPositions = (participantsPositions: { top: number; left: number }[]) =>
    participantsPositions.map(({ top, left }) => ({
        bottom: (100 - top) / 100,
        left: left / 100,
    }));
