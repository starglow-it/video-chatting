import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingChatList } from './MeetingChatList/MeetingChatList';
import { MeetingChatBar } from './MeetingChatBar/MeetingChatBar';

export const MeetingChat = () => {
    return (
        <CustomGrid
            display="flex"
            flex={1}
            flexDirection="column"
            height="100%"
        >
            <MeetingChatList />
            <MeetingChatBar />
        </CustomGrid>
    );
};
