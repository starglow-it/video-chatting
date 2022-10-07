import { getSharingStream } from '../../../../../helpers/media/getSharingStream';
import { updateMeetingSocketEvent } from '../../../meeting/sockets/model';

export const handleChooseSharingStream = async () => {
    try {
        const sharingStream = await getSharingStream();

        const sharingTrack = sharingStream?.getVideoTracks()?.[0];

        if (sharingTrack) {
            sharingTrack.onended = () => {
                updateMeetingSocketEvent({
                    sharingUserId: null,
                });
            };
        }

        return sharingStream;
    } catch (e) {
        console.log(e);
    }
};
