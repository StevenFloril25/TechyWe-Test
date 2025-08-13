import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

@Entity('products')
@Index(['name'], { unique: true })
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the product', example: 'iPhone 15 Pro' })
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'The description of the product', example: 'Latest iPhone with advanced features' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the product', example: 999.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'The stock quantity of the product', example: 50 })
  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'The category of the product', example: 'Electronics' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiProperty({ description: 'The creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
