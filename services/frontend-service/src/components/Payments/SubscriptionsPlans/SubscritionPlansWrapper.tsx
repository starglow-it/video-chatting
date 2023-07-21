import React, { memo, PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { planColors } from 'shared-const';

import { useNavigation } from 'shared-frontend/hooks/useNavigation';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

import styles from './SubscriptionsPlans.module.scss';

const Component = ({
    products,
    children,
}: PropsWithChildren<{ products: any[] }>) => {
    const productTabs = useMemo(() => {
        return products.map(({ product }) => ({
            value: product?.id,
            translationKey: product?.name,
        }));
    }, [products]);

    const { activeTab, onChange: onChangeActiveTab } = useNavigation({
        tabs: productTabs,
    });

    return (
        <CustomGrid
            container
            className={styles.tabsWrapper}
            direction="column"
            wrap="nowrap"
        >
            <CustomGrid
                container
                className={styles.tabs}
                wrap="nowrap"
                alignItems="center"
                gap={0.5}
            >
                {productTabs.map(tab => (
                    <CustomGrid
                        key={tab.value}
                        container
                        justifyContent="center"
                        alignItems="center"
                        style={
                            {
                                '--bg-color': planColors[tab.translationKey],
                            } as React.CSSProperties
                        }
                        className={clsx(styles.tabItem, {
                            [styles.active]: tab.value === activeTab.value,
                        })}
                        onClick={() => onChangeActiveTab(tab.value)}
                    >
                        <CustomTypography
                            variant="body3bold"
                            color="colors.white.primary"
                        >
                            {tab.translationKey}
                        </CustomTypography>
                    </CustomGrid>
                ))}
            </CustomGrid>
            <CustomGrid className={styles.subscriptionWrapper}>
                {React.Children.map(children, (child, index) => (
                    <Fade
                        key={products[index]?.product?.id}
                        in={activeTab.value === products[index]?.product?.id}
                        unmountOnExit
                    >
                        <CustomGrid
                            container
                            className={styles.subscriptionItem}
                        >
                            {child}
                        </CustomGrid>
                    </Fade>
                ))}
            </CustomGrid>
        </CustomGrid>
    );
};

export const SubscriptionPlansWrapper = memo(Component);

SubscriptionPlansWrapper.displayName = 'SubscriptionPlansWrapper';
