import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingChatList } from './MeetingChatList/MeetingChatList';
import { MeetingChatBar } from './MeetingChatBar/MeetingChatBar';

export const MeetingChat = () => {
    return (
        <CustomGrid
            display="flex"
            flexDirection="column"
            height="100%"
        >
            <MeetingChatList />
            <MeetingChatBar />
        </CustomGrid>
    );
};
