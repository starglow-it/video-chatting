export const changeTracksState = ({
    enabled,
    tracks,
}: {
    enabled: boolean;
    tracks: MediaStreamTrack[];
}) => {
    tracks?.forEach((t: MediaStreamTrack) => {
        t.enabled = enabled;
    });
};
