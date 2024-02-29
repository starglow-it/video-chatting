import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingTranscribeList } from './MeetingChatList/MeetingTranscribeList';

export const MeetingTranscribe = () => {
    return (
        <CustomGrid
            display="flex"
            flex={1}
            flexDirection="column"
            height="100%"
        >
            <MeetingTranscribeList />
        </CustomGrid>
    );
};
