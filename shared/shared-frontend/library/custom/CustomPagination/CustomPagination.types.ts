export type CustomPaginationProps = {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (pageValue: number) => void;
    isDisabled: boolean;
}