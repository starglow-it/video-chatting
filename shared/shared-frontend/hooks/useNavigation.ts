import { useCallback, useMemo, useState } from 'react';

export type Tab = {
    value: string;
    translationKey: string;
};

type UseChipsNavigationArgs = {
    tabs: Tab[];
};

type UseChipsNavigationReturn = {
    activeTab: Tab;
    onChange: (value: string) => void;
};

export const useNavigation = ({ tabs }: UseChipsNavigationArgs): UseChipsNavigationReturn => {
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
