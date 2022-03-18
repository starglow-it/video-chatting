import {$discoveryTemplatesStore, getUsersTemplatesFx} from './model';
import { handleFetchUsersTemplates } from '../handlers';

getUsersTemplatesFx.use(handleFetchUsersTemplates);

$discoveryTemplatesStore.on(getUsersTemplatesFx.doneData, (state, data) => {
    return {
        ...state,
        ...data,
    };
});
