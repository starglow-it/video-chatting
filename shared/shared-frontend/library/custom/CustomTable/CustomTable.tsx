import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

type ColumnType<T> = {
    tableHeadName: string;
    key: keyof T;
};

type CustomTableProps<Data> = {
    data: Array<Data>;
    columns: Array<ColumnType<Data>>;
};

import styles from './CustomTable.module.scss';

function Component<Data extends { id: number }>(props: CustomTableProps<Data>): JSX.Element {
    const {
        data,
        columns,
    } = props;

    const renderHeadColumns = useMemo(
        () =>
            columns?.map(column => (
                <TableCell className={styles.tableHeadCell} key={column.key as string}>
                    {column.tableHeadName}
                </TableCell>
            )),
        [columns],
    );

    const renderBody = useMemo(
        () =>
            data?.map(item => (
                <TableRow className={styles.tableBodyRow} hover key={item.id}>
                    {columns?.map(column => (
                        <TableCell className={styles.tableBodyCell} key={column.key as string}>
                            {item[column.key]}
                        </TableCell>
                    ))}
                </TableRow>
            )),
        [data],
    );

    return (
        <TableContainer>
            <Table className={styles.table}>
                <TableHead>
                    <TableRow>{renderHeadColumns}</TableRow>
                </TableHead>
                <TableBody>{renderBody}</TableBody>
            </Table>
        </TableContainer>
    );
}

const CustomTable = memo(Component) as typeof Component;

export default CustomTable;
