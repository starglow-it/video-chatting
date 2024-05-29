import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingQuestionAnswerList } from './MeetingQuestionAnswerList/MeetingQuestionAnswerList';
import { MeetingQuestionAnswerBar } from './MeetingQuestionAnswerBar/MeetingQuestionAnswerBar';
import { useStore } from 'effector-react';
import { $isOwner } from 'src/store/roomStores';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

export const MeetingQuestionAnswer = () => {
    const isOwner = useStore($isOwner);

    return (
        <CustomGrid
            display="flex"
            flex={1}
            flexDirection="column"
            height="100%"
        >
            <MeetingQuestionAnswerList />
            <ConditionalRender condition={isOwner}>
            {/* <ConditionalRender condition={!isOwner}> */}
                <MeetingQuestionAnswerBar />
            </ConditionalRender>
        </CustomGrid>
    );
};
