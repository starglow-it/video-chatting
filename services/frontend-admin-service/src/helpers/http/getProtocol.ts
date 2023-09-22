export const getProtocol = () => {
    return typeof window !== 'undefined' ? window.location.protocol : 'https:';
};
