import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

@Schema({ timestamps: true }) 
export class Media extends Document{
  @Prop({ type: String, enum: MediaType, required: true })
  mediaType: MediaType;

  @Prop({ type: String, required: true })
  mediaUrl: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
