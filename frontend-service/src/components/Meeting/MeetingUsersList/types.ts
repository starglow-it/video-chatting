import { MeetingUser } from '../../../store/types';

export type MeetingUsersListItemProps = {
    user: MeetingUser;
    isLocalItem?: boolean;
    isAcceptRequest?: boolean;
    onAcceptUser?: ((data: any) => void) | undefined;
    onDeleteUser?: ((data: any) => void) | undefined;
};
