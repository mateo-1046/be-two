import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  modelo: string;

  @IsNumber()
  @IsPositive()
  anio: number;

  @IsString()
  frase: string;
}
