import { useCallback, useMemo, useState } from 'react';

type Tab = {
    value: string;
    translationKey: string;
};

type UseChipsNavigationArgs = {
    activeTab: Tab;
    tabs: Tab[];
};

type UseChipsNavigationReturn = {
    onChange: (value: string) => void;
};

export const useChipsNavigation = ({ tabs }: UseChipsNavigationArgs): UseChipsNavigationReturn => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleChange = useCallback(
        (value: string) => {
            const newTab = tabs.find(({ value: tabValue }) => tabValue === value);
            if (!newTab) {
                return;
            }
            setActiveTab(newTab);
        },
        [tabs],
    );

    return useMemo(
        () => ({
            activeTab,
            onChange: handleChange,
        }),
        [activeTab, handleChange],
    );
};
