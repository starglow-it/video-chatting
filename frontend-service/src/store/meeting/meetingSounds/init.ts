import {$meetingSoundType, setMeetingSoundType} from "./model";

$meetingSoundType.on(setMeetingSoundType, (state, data) => data);