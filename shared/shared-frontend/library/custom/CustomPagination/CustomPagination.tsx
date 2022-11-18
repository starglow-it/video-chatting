import React, {memo, useCallback, useMemo} from "react";
import clsx from "clsx";

import {CustomGrid} from "../../custom";
import {ActionButton} from "../../common";
import {ArrowLeftIcon, ArrowRightIcon } from "../../../icons";

import {CustomPaginationProps} from "./CustomPagination.types";

import styles from './CustomPagination.module.scss';

const Component = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    isDisabled
}: CustomPaginationProps) => {
    const maxPages = Math.ceil(count / rowsPerPage);

    const handlePreviousPage = useCallback(() => {
        onPageChange?.(page === 1 ? 1 : page - 1);
    }, [page, onPageChange]);

    const handleNextPage = useCallback(() => {
        onPageChange?.(maxPages === page ? page : page + 1);
    }, [count, rowsPerPage, page, onPageChange]);

    const renderPagesButtons = useMemo(() => {
        const indexArray = new Array(maxPages).fill(0).map((number, index) => index + 1);

        const slicedIndexArray = [
            (page > 5 ? indexArray.slice(0, 2) : indexArray),
            (page >= maxPages - 5 ? [] : page <= 5 ? indexArray.slice(0, 7) : indexArray.slice(page - 3, page)),
            (page <= 5 ? [] : page >= maxPages - 5 ? indexArray.slice(maxPages - 7, maxPages) : indexArray.slice(page, page + 2)),
            (page < maxPages - 5 ? indexArray.slice(maxPages - 2, maxPages) : []),
        ].flat();

        const arrayWithSeparator = slicedIndexArray.reduce((acc, number, index, arr) => (
            (index === 0 || number - arr[index - 1] === 1) ? [...acc, number] : [...acc, '...', number]
        ), []);

        return arrayWithSeparator.map(number => {
            const handleChangePage = () => {
                onPageChange?.(number);
            }

            const isPageActive = page === number;

            return (
                <ActionButton
                    disabled={isDisabled}
                    variant={isPageActive ? 'black' : 'transparentPrimary'}
                    onAction={typeof number === 'number' ? handleChangePage : undefined}
                    className={clsx(styles.pageButton)}
                    label={number}
                />
            );
        });
    }, [maxPages, page, count, rowsPerPage, onPageChange, isDisabled]);

    return (
        <CustomGrid container justifyContent="space-evenly">
            <ActionButton
                disabled={isDisabled}
                variant="cancel"
                onAction={handlePreviousPage}
                className={styles.pageButton}
                Icon={<ArrowLeftIcon width="24px" height="24px" />}
            />
            <CustomGrid container justifyContent="center" flex="1 1" gap={1}>
                {renderPagesButtons}
            </CustomGrid>
            <ActionButton
                disabled={isDisabled}
                variant="cancel"
                onAction={handleNextPage}
                className={styles.pageButton}
                Icon={<ArrowRightIcon width="24px" height="24px" />}
            />
        </CustomGrid>
    )
}

const CustomPagination = memo(Component);

export default CustomPagination;