import * as AWS  from 'aws-sdk';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosFileAccess');

const s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.TODO_IMAGES_S3_BUCKET;
const urlExpiration: Number = Number(process.env.SIGNED_URL_EXPIRATION);

export class ImageAccess {

  async getUploadUrl(imageId: string): Promise<string> {
    const result = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    });

    logger.info('result', { result: result });

    return result;
  }
}
