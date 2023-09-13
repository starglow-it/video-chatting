import { useEffect, useState } from 'react';

type NetworkStatus = 'on' | 'off' | string;

type Props = {
    callbackOn?(): void;
    callbackOff?(): void;
};

export const useNetworkDetect = ({ callbackOn, callbackOff }: Props) => {
    const [status, setStatus] = useState<NetworkStatus>(
        window.navigator.onLine ? 'on' : 'off',
    );

    const handleNetworkOn = () => {
        setStatus('on');
        callbackOn?.();
    };

    const handleNetworkOff = () => {
        setStatus('off');
        callbackOff?.();
    };

    useEffect(() => {
        window.addEventListener('online', handleNetworkOn);
        window.addEventListener('offline', handleNetworkOff);
        return () => {
            window.removeEventListener('online', handleNetworkOn);
            window.removeEventListener('offline', handleNetworkOff);
        };
    }, []);

    return { status };
};
