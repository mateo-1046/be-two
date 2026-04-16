import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BikeType {
  MOUNTAIN = 'mountain',
  ROAD = 'road',
  CITY = 'city',
  ELECTRIC = 'electric',
}

@Schema()
export class Bike extends Document {
  @Prop({ unique: true, index: true })
  marca: string;

  @Prop()
  tipo: string;

  @Prop()
  velocidades: number;

  @Prop()
  descripcion: string;
}

export const BikeSchema = SchemaFactory.createForClass(Bike);
