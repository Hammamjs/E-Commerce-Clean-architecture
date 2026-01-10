import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than zero' })
  price: number;

  @IsNotEmpty()
  @IsPositive({ message: 'Price must be greater than zero' })
  inStock: number;
}
