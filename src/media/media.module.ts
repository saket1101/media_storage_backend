import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media, MediaSchema } from './schema/media.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from './s3.service';

@Module({
  imports:[MongooseModule.forFeature([{name:Media.name, schema: MediaSchema}])],
  controllers: [MediaController],
  providers: [MediaService,S3Service],
})
export class MediaModule {}
