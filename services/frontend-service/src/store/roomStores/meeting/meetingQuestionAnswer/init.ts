import { convertQuestionItem } from 'src/utils/functions/convertQuestionItem';
import { resetRoomStores } from 'src/store/root';
import { combine, sample } from 'effector';
import {
    $isHaveNewQuestion,
    $isThereNewQuestion,
    $meetingQuestionAnswer,
    addQuestionToQuestionAnswerEvent,
    reactionQuestionAnswerEvent,
    resetHaveNewQuestionEvent,
    setCountNewQuestionEvent,
} from './model';
import { $localUserStore } from '../../users/localUser/model';
import { $activeTabPanel } from '../meeting/model';
import {
    $isToggleUsersPanel,
    toggleUsersPanelEvent,
} from '../../users/meetingUsers/model';
import { $isAudience } from '../meetingRole/model';

$meetingQuestionAnswer
    .on(addQuestionToQuestionAnswerEvent, (state, question) => ({
        ...state,
        list: [...state.list, ...convertQuestionItem(question, state.list)],
    }))
    .on(reactionQuestionAnswerEvent, (state, data) => {
        return {
            ...state,
            list: state.list.map(item => {
                if (item.id === data.question.id) {
                    return { ...item, ...data.question };
                }
                return item;
            }),
        };
    })
    .reset(resetRoomStores);

$isThereNewQuestion
    .on(addQuestionToQuestionAnswerEvent, () => Date.now())
    .reset(resetRoomStores);

$isHaveNewQuestion
    .on(setCountNewQuestionEvent, (_, number) => number)
    .reset(resetHaveNewQuestionEvent);

sample({
    clock: addQuestionToQuestionAnswerEvent,
    source: combine({
        localUser: $localUserStore,
        activeTab: $activeTabPanel,
        isOpenPanel: $isToggleUsersPanel,
        isAudience: $isAudience,
    }),
    filter: ({ localUser, activeTab, isOpenPanel, isAudience }, question) =>
        localUser.id !== question?.sender?.id &&
        ((activeTab !== 2 && !isAudience) || !isOpenPanel),
    fn: () => Date.now(),
    target: setCountNewQuestionEvent,
});

sample({
    clock: toggleUsersPanelEvent,
    source: combine({
        activeTab: $activeTabPanel,
        isOpenPanel: $isToggleUsersPanel,
        isAudience: $isAudience,
    }),
    filter: ({ activeTab, isOpenPanel, isAudience }) =>
        (isOpenPanel && activeTab === 2) || isOpenPanel || isAudience,
    fn: () => 0,
    target: setCountNewQuestionEvent,
});
