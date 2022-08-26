import { useLayoutEffect, useMemo, useState } from 'react';
import Bowser from 'bowser';
import { getBrowserData } from '../utils/browser/detectBrowser';

export const useBrowserDetect = () => {
    const [browserData, setBrowserData] = useState<Bowser.Parser.ParsedResult | null>(null);

    useLayoutEffect(() => {
        const newBrowserData = getBrowserData();

        setBrowserData(newBrowserData);
    }, []);

    const isSafari = useMemo(() => browserData?.browser.name === 'Safari', [browserData]);

    const isMobile = useMemo(() => browserData?.platform.type === 'mobile', [browserData]);

    return useMemo(
        () => ({
            isMobile,
            isSafari,
            browserData,
        }),
        [isMobile, isSafari, browserData],
    );
};
