import { useEffect, useMemo, useState } from 'react';
import Bowser from 'bowser';
import { getBrowserData } from 'shared-utils';

export const useBrowserDetect = () => {
    const [browserData, setBrowserData] = useState<Bowser.Parser.ParsedResult | null>(null);

    useEffect(() => {
        const newBrowserData = getBrowserData();

        setBrowserData(newBrowserData);
    }, []);

    const isSafari = useMemo(() => browserData?.browser.name === 'Safari', [browserData]);

    const isMobile = useMemo(() => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(max-width: 767px)").matches, [browserData]);

    return useMemo(
        () => ({
            isMobile,
            isSafari,
            browserData,
        }),
        [isMobile, isSafari, browserData],
    );
};
