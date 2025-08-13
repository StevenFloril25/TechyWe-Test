import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ 
    description: 'The name of the product', 
    example: 'iPhone 15 Pro',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ 
    description: 'The description of the product', 
    example: 'Latest iPhone with advanced features',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'The price of the product', 
    example: 999.99,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    description: 'The stock quantity of the product', 
    example: 50,
    minimum: 0,
    required: false,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ 
    description: 'The category of the product', 
    example: 'Electronics',
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
