import { sendRequest } from 'src/helpers/http/sendRequest';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { VideoBlob } from 'src/types';
import { uploadRecordVideoUrl } from 'src/utils/urls';

export const handleUploadToS3 = async (videoBlob: VideoBlob): Promise<string> => {
  if (!videoBlob) {
    // It's a good practice to handle potential null or undefined values explicitly
    throw new Error("No video blob provided");
  }

  const formData = new FormData();
  const fileName = "meetingRecordVideo.mp4"; // Name of the file
  const fileType = "video/mp4"; // MIME type of the file

  const videoFile = new File([videoBlob], fileName, {
    type: fileType,
    lastModified: new Date().getTime(), // You can replace this with videoBlob's lastModified if available
  });

  formData.append('meetingRecordVideo', videoFile, fileName);

  try {
    const { result } = await sendRequest({
      ...uploadRecordVideoUrl,
      data: formData,
    });
    return new Promise((resolve, reject) => resolve(result as string)); // Assuming 'result' is the response you want to return
  } catch (error) {
    console.error("Error uploading video: ", error);
    throw error; // Rethrowing the error is a good practice for error handling in async functions
  }
}