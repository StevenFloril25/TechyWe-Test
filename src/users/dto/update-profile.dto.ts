import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ 
    description: 'The email address of the user', 
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    description: 'The password of the user', 
    example: 'newpassword123',
    minLength: 6,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
