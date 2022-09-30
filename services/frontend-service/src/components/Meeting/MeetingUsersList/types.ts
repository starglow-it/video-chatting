import { MeetingUser } from '../../../store/types';

export type MeetingUsersListItemProps = {
    user: MeetingUser;
    isLocalItem?: boolean;
    isOwnerItem?: boolean;
    isAcceptRequest?: boolean;
    onAcceptUser?: ((data: { userId: MeetingUser['id'] }) => void) | undefined;
    onDeleteUser?: ((data: { userId: MeetingUser['id'] }) => void) | undefined;
    onChangeHost?: ((data: { userId: MeetingUser['id'] }) => void) | undefined;
};
