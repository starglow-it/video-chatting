import { VideoChatSocketSubscribers } from '../../../../const/socketEvents/subscribers';
import { getVideoChatSocketSubscribeHandler } from './handlers';
import { initiateMeetingSocketConnectionFx } from '../../meetingSocket/model';

initiateMeetingSocketConnectionFx.doneData.watch(({ socketInstance }) => {
    if (socketInstance) {
        socketInstance.on(
            VideoChatSocketSubscribers.OnGetOffer,
            getVideoChatSocketSubscribeHandler(
                VideoChatSocketSubscribers.OnGetOffer,
            ),
        );

        socketInstance.on(
            VideoChatSocketSubscribers.OnGetAnswer,
            getVideoChatSocketSubscribeHandler(
                VideoChatSocketSubscribers.OnGetAnswer,
            ),
        );

        socketInstance.on(
            VideoChatSocketSubscribers.OnGetIceCandidate,
            getVideoChatSocketSubscribeHandler(
                VideoChatSocketSubscribers.OnGetIceCandidate,
            ),
        );
    }
});
