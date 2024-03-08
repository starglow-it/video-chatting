const calDiffOfTimes = (prevTime: string, nextTime: string) => {
    console.log(prevTime, nextTime);
    if (prevTime && nextTime) {
        const date1 = new Date(prevTime);
        const date2 = new Date(nextTime);

        const differenceInMillis = Math.round((date2.getTime() - date1.getTime()) / (1000 * 60));

        return differenceInMillis > 1 ? differenceInMillis : 1;
    } else return 0;
};


export default calDiffOfTimes;