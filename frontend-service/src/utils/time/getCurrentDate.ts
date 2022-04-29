import getDate from 'date-fns/getDate';

export const getCurrentDate = () => {
    return getDate(Date.now());
};
