import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Media } from './schema/media.schema';
import { Model } from 'mongoose';
import { S3Service } from './s3.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private MediaModel: Model<Media>,
    private s3Service: S3Service,
  ) {}

  async upload(body: any, file: Express.Multer.File, res: Response) {
    try {
      const { type } = body;
      if (!file) {
        return res.status(400).json({ message: 'Please provide a file' });
      }

      if (!type) {
        return res.status(400).json({ message: 'Please provide a type' });
      }
      let folder = 'development';
      const url = await this.s3Service.uploadFile(file, folder);

      const newMedia = new this.MediaModel({
        mediaType:type,
        mediaUrl:url,
      });

      await newMedia.save();

      return res
        .status(201)
        .json({ message: 'Media uploaded successfully', status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async findAll(type: string, res: Response) {
    try {
      const filter = type ? { mediaType: type } : {};
      const media = await this.MediaModel.find(filter);

      return res.status(200).json({
        message: 'Media fetched successfully',
        status: true,
        data: media,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async remove(id: string, res: Response) {
    try {
      const media = await this.MediaModel.findById(id);
      if (!media) {
        return res.status(404).json({ message: 'Media not found' });
      }
      await this.s3Service.deleteFileByUrl(media.mediaUrl);

      await this.MediaModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: 'Media deleted successfully', status: true });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
