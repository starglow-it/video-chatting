import { useEffect, memo, useMemo, useCallback, useState } from 'react';
import { useStore } from 'effector-react';
import debounce from '@mui/utils/debounce';
import Slide from '@mui/material/Slide';
import clsx from 'clsx';

import { useLocalization } from '@hooks/useTranslation';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTable } from 'shared-frontend/library/custom/CustomTable';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomSearch } from 'shared-frontend/library/custom/CustomSearch';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import { ICommonUser, PlanKeys } from 'shared-types';

import { Translation } from '@components/Translation/Translation';
import { UserProfile } from '@components/Users/UserProfile/UserProfile';
import { UserTableActions } from '@components/Users/UserTableActions/UserTableActions';
import { BlockUserDialog } from '@components/Dialogs/BlockUserDialog/BlockUserDialog';
import { DeleteUserDialog } from '@components/Dialogs/DeleteUserDialog/DeleteUserDialog';

// store
import {
    $userProfileIdStore,
    $usersStore,
    setUserProfileIdEvent,
    searchUsersFx,
} from '../../store';

// styles
import styles from './UsersContainer.module.scss';

type UsersTableDataType = {
    id: string;
    companyName: { label: string; action?: () => void };
    email: { label: string; action?: () => void };
    fullName: { label: string; action?: () => void };
    subscriptionPlanKey: { label: string; action?: () => void };
    status: { label: string; action?: () => void };
};

type UsersTableHeadType = {
    tableHeadName: string;
    key: keyof UsersTableDataType;
};

const tableColumnsKeys: UsersTableHeadType['key'][] = [
    'companyName',
    'email',
    'fullName',
    'subscriptionPlanKey',
    'status',
];

const USERS_LIMIT = 20;

const Component = () => {
    const { state: usersList } = useStore($usersStore);
    const { state: activeUserId } = useStore($userProfileIdStore);

    const isUsersLoading = useStore(searchUsersFx.pending);

    const [page, setPage] = useState(1);
    const [userSearch, setUserSearch] = useState('');

    const { translation } = useLocalization('users');

    const tableHeadData = useMemo(
        () =>
            tableColumnsKeys.map(key => ({
                key,
                tableHeadName: translation(`table.${key}`),
            })),
        [],
    );

    const handleChooseUser = useCallback(
        ({ userId }: { userId: ICommonUser['id'] }) => {
            setUserProfileIdEvent(userId);
        },
        [],
    );

    const tableData = useMemo(
        () =>
            usersList?.list?.map(user => ({
                id: user.id,
                companyName: {
                    label: user.companyName,
                    action: () => {
                        handleChooseUser({
                            userId: user.id,
                        });
                    },
                },
                email: {
                    label: user.email,
                },
                fullName: {
                    label: user.fullName,
                },
                subscriptionPlanKey: {
                    label: user.subscriptionPlanKey ?? PlanKeys.House,
                },
                status: {
                    label: user.isBlocked ? 'Blocked' : 'Active',
                    style: clsx(styles.active, {
                        [styles.blocked]: user.isBlocked,
                    }),
                },
            })),
        [usersList?.list],
    );

    const handleChangePage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSearchUsers = useCallback(
        async ({ search, page: newPage }: { search: string }) => {
            searchUsersFx({
                skip: (newPage - 1) * USERS_LIMIT,
                limit: USERS_LIMIT,
                search,
            });
        },
        [],
    );

    const usersSearchRequest = useMemo(
        () =>
            debounce<(data: { page: number; search: string }) => Promise<void>>(
                handleSearchUsers,
                500,
            ),
        [],
    );

    useEffect(() => {
        (async () => {
            usersSearchRequest({
                search: userSearch,
                page,
            });
        })();
    }, [userSearch, page, usersSearchRequest]);

    const handleChangeUsersSearch = useCallback(event => {
        setUserSearch(() => event.target.value);
        setPage(() => 1);
    }, []);

    return (
        <CustomGrid
            position="relative"
            container
            direction="column"
            alignItems="center"
        >
            <Slide direction="right" in={!activeUserId} unmountOnExit>
                <CustomGrid
                    container
                    className={styles.wrapper}
                    direction="column"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <CustomGrid
                        container
                        justifyContent="center"
                        alignItems="center"
                        gap={1.5}
                    >
                        <CustomTypography variant="h1">
                            <Translation
                                nameSpace="users"
                                translation="common.title"
                            />
                        </CustomTypography>
                        <CustomChip
                            withoutAction
                            className={styles.chip}
                            active
                            label={usersList.count}
                        />
                    </CustomGrid>

                    <CustomSearch
                        className={styles.search}
                        value={userSearch}
                        onChange={handleChangeUsersSearch}
                        placeholder="Company, Email or Personal name"
                    />

                    {usersList?.list?.length === 0 || usersList.count === 0 ? (
                        <CustomGrid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            className={styles.noData}
                        >
                            <CustomImage
                                src="/images/magnifyingGlass.webp"
                                width={40}
                                height={40}
                                alt="users-container"
                            />
                            <CustomTypography variant="body2">
                                <Translation
                                    nameSpace="statistics"
                                    translation={
                                        usersList.count === 0 && !userSearch
                                            ? 'users.users.noData'
                                            : 'users.search.noData'
                                    }
                                />
                            </CustomTypography>
                        </CustomGrid>
                    ) : (
                        <CustomPaper className={styles.paper}>
                            <CustomTable<UsersTableDataType>
                                columns={tableHeadData}
                                data={tableData}
                                count={usersList.count}
                                rowsPerPage={USERS_LIMIT}
                                page={page}
                                onPageChange={handleChangePage}
                                isTableUpdating={isUsersLoading}
                                bodyCellClassName={styles.cell}
                                headCellClassName={styles.headCell}
                                ActionsComponent={UserTableActions}
                            />
                        </CustomPaper>
                    )}
                </CustomGrid>
            </Slide>

            <Slide direction="left" in={Boolean(activeUserId)} unmountOnExit>
                <CustomGrid
                    container
                    className={styles.wrapper}
                    direction="column"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <UserProfile />
                </CustomGrid>
            </Slide>
            <BlockUserDialog />
            <DeleteUserDialog />
        </CustomGrid>
    );
};

export const UsersContainer = memo(Component);
