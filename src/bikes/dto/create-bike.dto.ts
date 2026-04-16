import { IsEnum, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { BikeType } from '../entities/bike.entity';

export class CreateBikeDto {
  // TODO: Add @IsString() and @MinLength(2)
  marca: string;

  // TODO: Add @IsEnum(BikeType)
  // Valid values are in the BikeType enum: mountain, road, city, electric
  tipo: BikeType;

  // TODO: Add @IsNumber() and @IsPositive()
  velocidades: number;

  // TODO: Add @IsString()
  descripcion: string;
}
