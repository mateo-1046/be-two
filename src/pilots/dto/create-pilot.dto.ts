import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePilotDto {
  @IsString()
  nombre: string;

  @IsString()
  escuderia: string;

  @IsNumber()
  @IsPositive()
  numero: number;

  @IsBoolean()
  activo: boolean;

  @IsNumber()
  @Min(0)
  campeonatos: number;
}