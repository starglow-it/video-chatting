import React, { useEffect, memo, useMemo, useCallback, useState } from 'react';
import { useStore } from 'effector-react';

import {
    CustomGrid,
    CustomPaper,
    CustomTable,
    CustomTypography,
    CustomChip,
} from 'shared-frontend';
import { Translation } from '@components/Translation/Translation';

import { useLocalization } from '@hooks/useTranslation';

// store
import { CustomSearch } from '@components/CustomSearch/CustomSearch';
import debounce from '@mui/utils/debounce';
import { $usersStore, getUsersListFx } from '../../store';

// styles
import styles from './UsersContainer.module.scss';

type UsersTableDataType = {
    id: number;
    companyName: string;
    email: string;
    fullName: string;
    stripePlanKey: string;
    status: string;
};

type UsersTableHeadType = {
    tableHeadName: string;
    key: keyof UsersTableDataType;
};

const tableColumnsKeys: UsersTableHeadType['key'][] = [
    'companyName',
    'email',
    'fullName',
    'stripePlanKey',
    'status',
];

const Component = () => {
    const { state: usersList } = useStore($usersStore);
    const isUsersLoading = useStore(getUsersListFx.pending);

    const [page, setPage] = useState(1);
    const [userSearch, setUserSearch] = useState('');

    const { translation } = useLocalization('users');

    useEffect(() => {
        getUsersListFx({ skip: (page - 1) * 6, limit: 6 });
    }, [page]);

    const tableHeadData = useMemo(
        () =>
            tableColumnsKeys.map(key => ({
                key,
                tableHeadName: translation(`table.${key}`),
            })),
        [],
    );

    const tableData = useMemo(
        () =>
            usersList?.list?.map(user => ({
                id: user.id,
                companyName: user.companyName,
                email: user.email,
                fullName: user.fullName,
                stripePlanKey: user.stripePlanKey ?? 'House',
                status: 'Active',
            })),
        [usersList?.list],
    );

    const handleChangePage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSearchUsers = useCallback(
        async ({ search }: { search: string }) => {
            getUsersListFx({ skip: (page - 1) * 6, limit: 6, search });
        },
        [page],
    );

    const usersSearchRequest = useMemo(
        () => debounce<(data: { search: string }) => Promise<void>>(handleSearchUsers, 1000),
        [],
    );

    useEffect(() => {
        (async () => {
            usersSearchRequest({ search: userSearch });
        })();
    }, [userSearch]);

    const handleChangeUsersSearch = event => {
        setUserSearch(event.target.value);
    };

    return (
        <CustomGrid
            container
            className={styles.wrapper}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CustomGrid container justifyContent="center" alignItems="center" gap={1.5}>
                <CustomTypography variant="h1">
                    <Translation nameSpace="users" translation="common.title" />
                </CustomTypography>
                <CustomChip withoutAction className={styles.chip} active label={usersList.count} />
            </CustomGrid>

            <CustomSearch
                className={styles.search}
                value={userSearch}
                onChange={handleChangeUsersSearch}
                placeholder="Company, Email or Personal name"
            />

            <CustomPaper className={styles.paper}>
                <CustomTable<UsersTableDataType>
                    columns={tableHeadData}
                    data={tableData}
                    count={usersList.count}
                    rowsPerPage={20}
                    page={page}
                    onPageChange={handleChangePage}
                    isTableUpdating={isUsersLoading}
                    bodyCellClassName={styles.cell}
                    headCellClassName={styles.headCell}
                />
            </CustomPaper>
        </CustomGrid>
    );
};

export const UsersContainer = memo(Component);
