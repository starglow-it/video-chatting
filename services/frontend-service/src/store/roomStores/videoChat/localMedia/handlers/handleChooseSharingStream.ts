import { getSharingStream } from '../../../../../helpers/media/getSharingStream';

export const handleChooseSharingStream = async () => {
    try {
        return getSharingStream();
    } catch (e) {
        console.log(e);
    }
};
