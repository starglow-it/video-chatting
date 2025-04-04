import React, { memo, useMemo } from "react";
import clsx from "clsx";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { CustomPagination } from "../../custom/CustomPagination";
import { ConditionalRender } from "../../common/ConditionalRender";

import styles from "./CustomTable.module.scss";
import { CustomTableProps } from "./CustomTable.types";

function Component<Data extends { id: number | string }>(
  props: CustomTableProps<Data>
): JSX.Element {
  const {
    data,
    columns,
    count = 0,
    page = 1,
    rowsPerPage = 20,
    onPageChange,
    onRowAction,
    isTableUpdating = false,
    bodyCellClassName,
    headCellClassName,
    ActionsComponent,
    withSubdomain = false,
  } = props;

  const renderHeadColumns = useMemo(
    () =>
      columns?.map((column) => (
        <TableCell
          className={clsx(styles.tableHeadCell, headCellClassName)}
          key={column.key as string}
        >
          {column.tableHeadName}
        </TableCell>
      )),
    [columns]
  );

  const renderBody = useMemo(
    () =>
      data?.map((item) => {
        const handleAction = () => {
          onRowAction?.({ itemId: item.id as string });
        };

        return (
          <TableRow
            onClick={handleAction}
            className={styles.tableBodyRow}
            hover
            key={item.id}
          >
            {columns?.map((column) => (
              <TableCell
                key={`${item.id}_${column.key}` as string}
                onClick={item[column.key]?.action}
                className={clsx(
                  styles.tableBodyCell,
                  bodyCellClassName,
                  item[column.key]?.style,
                  { [styles.withAction]: Boolean(item[column.key]?.action) }
                )}
              >
                {item[column.key].label}
              </TableCell>
            ))}
            <ConditionalRender condition={Boolean(ActionsComponent)}>
              <TableCell
                key="actions"
                className={clsx(styles.tableBodyCell, bodyCellClassName)}
              >
                <ActionsComponent
                  actionId={item.id}
                  withSubdomain={withSubdomain}
                />
              </TableCell>
            </ConditionalRender>
          </TableRow>
        );
      }),
    [data, columns]
  );

  return (
    <TableContainer>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            {renderHeadColumns}
            <ConditionalRender condition={Boolean(ActionsComponent)}>
              <TableCell
                className={clsx(styles.tableHeadCell, headCellClassName)}
                key="actions"
              >
                {""}
              </TableCell>
            </ConditionalRender>
          </TableRow>
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
