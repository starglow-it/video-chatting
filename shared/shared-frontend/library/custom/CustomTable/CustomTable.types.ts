export type ColumnType<T> = {
    tableHeadName: string;
    key: keyof T;
};

export type CustomTableProps<Data> = {
    data: Array<Data>;
    columns: Array<ColumnType<Data>>;
    count?: number;
    page?: number;
    rowsPerPage?: number;
    isTableUpdating?: boolean;
    bodyCellClassName: string;
    headCellClassName: string;
    ActionsComponent?: any;
    onPageChange?: (pageValue: number) => void;
};