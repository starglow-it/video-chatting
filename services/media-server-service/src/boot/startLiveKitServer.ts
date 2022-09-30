import { RoomServiceClient, Room } from "livekit-server-sdk";
import { getConfigVar } from "../services/config";

export const startLiveKitServer = async () => {
    try {
        const apiKey = await getConfigVar("livekitApiKey");
        const apiSecret = await getConfigVar("livekitApiSecret");
        const livekitHost = await getConfigVar("livekitHost");

        const svc = new RoomServiceClient(livekitHost, apiKey, apiSecret);

        svc.listRooms()
            .then((rooms: Room[]) => {
                console.log("existing rooms", rooms);

                rooms.forEach((room) => {
                    svc.deleteRoom(room.name).then(() => {
                        console.log("room deleted");
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (e) {
        console.log(e);
    }
};
