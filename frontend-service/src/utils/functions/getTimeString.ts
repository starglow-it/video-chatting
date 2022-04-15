import { ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "../../const/time/common";

const stages = [
    ONE_HOUR,
    ONE_MINUTE,
    ONE_SECOND
];

const stagesName = [ 'h', 'm', 's' ];

/**
 * Util function that transforms number timestamp to the readable time string in format:
 * seconds - 1s - 60s
 * minutes - 1m - 60m
 * hours - 1h - 24h
 */
export const getTimeString = (timestamp: number) => {
    const diff = Date.now() - timestamp;

    const targetStageIndex = stages.findIndex(stage => diff / stage >= 1);

    const targetStageValue = stages[targetStageIndex];
    const reminderName = stagesName[targetStageIndex];

    const reminderAmount = Math.floor(diff / targetStageValue);

    return diff < ONE_SECOND ? 'Just now' : `${reminderAmount}${reminderName}`;
}