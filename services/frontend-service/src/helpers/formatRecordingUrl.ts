const formatRecordingUrls = (videos: MeetingRecordVideo[]): { [key: string]: MeetingRecordVideo[] } => {
    videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const groupedItems: { [key: string]: MeetingRecordVideo[] } = videos.reduce((acc, item) => {
        if (!acc[item.meeting]) {
            acc[item.meeting] = [item];
        } else {
            acc[item.meeting].push(item);
        }
        return acc;
    }, {});

    return groupedItems;
};

export default formatRecordingUrls;