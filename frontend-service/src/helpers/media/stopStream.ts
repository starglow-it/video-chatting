export const stopStream = (stream: MediaStream | null) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};
