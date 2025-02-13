import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() body:string,@UploadedFile() file:Express.Multer.File,@Res() res:Response) {
    return this.mediaService.upload(body,file,res);
  }

  @Get('allfiles')
  findAll(@Query('type') type: string , @Res() res:Response) {
    return this.mediaService.findAll(type,res);
  }


}
