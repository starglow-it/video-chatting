import {ONE_HOUR, ONE_MINUTE } from "../../const/time/common";
import {addZero} from "../functions/addZero";

export const formatCountDown = (time: number) => {
    const hoursNumber = time / ONE_HOUR;
    const minutesNumber = time % ONE_HOUR;

    const secondsNumber = Math.floor(minutesNumber % ONE_MINUTE / 1000);

    const minutes = Math.floor(minutesNumber / ONE_MINUTE);
    const hours = Math.floor(hoursNumber);

    const finalHours = hours ? `${addZero(hours)}:` : '';

    return `${finalHours}${addZero(minutes)}:${addZero(secondsNumber)}`;
};