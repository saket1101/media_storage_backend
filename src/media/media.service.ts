import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  async upload(body: string, file: Express.Multer.File, res: Response) {
    return 'This action adds a new media';
  }

  async findAll(type: string, res: Response) {
    return 'This action returns all media';
  }
}
