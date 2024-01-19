import { S3 } from 'aws-sdk';
import { VideoBlob } from 'src/types';

export const handleUploadToS3 = async (videoBlob: VideoBlob) => {
    if (videoBlob) {
        const s3 = new S3(/* Config */);
        const params: S3.Types.PutObjectRequest = {
          Bucket: 'your-bucket-name',
          Key: 'your-video-name.mp4',
          Body: videoBlob,
        };
        return s3.upload(params).promise();
    }
    return new Promise(()=> videoBlob)
}