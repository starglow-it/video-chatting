import React, { memo, useMemo } from 'react';

import { List, ListItem } from '@mui/material';
import { CustomListProps } from './types';

import styles from './CustomList.module.scss';

const CustomList = memo(({ listElements }: CustomListProps) => {
    const renderListItems = useMemo(
        () =>
            listElements.map(({ key, element }) => (
                <ListItem key={key} className={styles.listItem} disablePadding>
                    {element}
                </ListItem>
            )),
        [listElements],
    );

    return <List disablePadding>{renderListItems}</List>;
});

export { CustomList };
