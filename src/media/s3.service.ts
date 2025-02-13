// src/s3/s3.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly awsurl: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: process.env.region,
      credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
      },
    });
    this.bucket = process.env.bucket;
    this.awsurl = process.env.awsurl;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<string> {
    const sanitizedFileName = file.originalname.replace(/\s+/g, '-');
    const timestamp = Date.now();
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const fileKey = folder ? `${folder}/${fileName}` : fileName;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const publicUrl = `${this.awsurl}${fileKey}`;

    return publicUrl;
  }

  async getFileUrl(fileName: string, folder: string = ''): Promise<string> {
    const fileKey = folder ? `${folder}/${fileName}` : fileName;
    const publicUrl = `${this.awsurl}${fileKey}`;
    return publicUrl;
  }

  async deleteFileByUrl(url: string): Promise<void> {
    const fileKey = this.extractFileKeyFromUrl(url);
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }

  private extractFileKeyFromUrl(url: string): string {
    if (!url.startsWith(this.awsurl)) {
      throw new Error('Invalid CloudFront URL');
    }

    return url.replace(this.awsurl, '');
  }
}
