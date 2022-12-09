import React, {memo, useCallback, useMemo} from "react";
import clsx from "clsx";

import {CustomGrid} from "../../custom/CustomGrid";
import {ActionButton} from "../../common/ActionButton";
import { ArrowRightIcon } from "../../../icons/OtherIcons/ArrowRightIcon";
import { ArrowLeftIcon } from "../../../icons/OtherIcons/ArrowLeftIcon";

import {CustomPaginationProps} from "./CustomPagination.types";

import styles from './CustomPagination.module.scss';
import usePagination from "@mui/material/usePagination";

const Component = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    isDisabled
}: CustomPaginationProps) => {
    const maxPages = Math.ceil(count / rowsPerPage);

    const data = usePagination({
        count,
        page,
        onChange: (...args) => {
            console.log(args);
            onPageChange();
        }
    });

    const handlePreviousPage = useCallback(() => {
        onPageChange?.(page === 1 ? 1 : page - 1);
    }, [page, onPageChange]);

    const handleNextPage = useCallback(() => {
        onPageChange?.(maxPages === page ? page : page + 1);
    }, [count, rowsPerPage, page, onPageChange]);

    const renderPagesButtons = useMemo(() => {
        return data.items.map(({ onClick, selected, disabled, page, type }) => {

            console.log(type);

            return (
                <ActionButton
                    disabled={isDisabled || disabled}
                    variant={selected ? 'black' : 'transparentPrimary'}
                    onAction={page ? onClick : undefined}
                    className={clsx(styles.pageButton)}
                    label={page}
                />
            )
        })
    }, [])

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