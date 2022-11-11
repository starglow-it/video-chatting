import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {CustomPagination} from "../../custom";

import styles from './CustomTable.module.scss';
import {CustomTableProps} from "./CustomTable.types";
import {ConditionalRender} from "../../common";
import clsx from "clsx";

function Component<Data extends { id: number | string }>(props: CustomTableProps<Data>): JSX.Element {
    const {
        data,
        columns,
        count,
        page,
        rowsPerPage,
        onPageChange,
        isTableUpdating,
        bodyCellClassName,
        headCellClassName
    } = props;

    const renderHeadColumns = useMemo(
        () =>
            columns?.map(column => (
                <TableCell className={clsx(styles.tableHeadCell, headCellClassName)} key={column.key as string}>
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
                        <TableCell className={clsx(styles.tableBodyCell, bodyCellClassName)} key={`${item.id}_${column.key}` as string}>
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
            <ConditionalRender condition={count > rowsPerPage}>
                <CustomPagination
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    isDisabled={isTableUpdating}
                />
            </ConditionalRender>
        </TableContainer>
    );
}

const CustomTable = memo(Component) as typeof Component;

export default CustomTable;
