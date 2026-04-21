import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pilot extends Document {
  
  @Prop({
    required: true,
  })
  nombre: string;

  @Prop({
    required: true,
  })
  escuderia: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  numero: number;

  @Prop({
    required: true,
  })
  activo: boolean;

  @Prop({
    required: true,
    min: 0,
  })
  campeonatos: number;
}

export const PilotSchema = SchemaFactory.createForClass(Pilot);