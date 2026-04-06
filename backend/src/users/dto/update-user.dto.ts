import { IsEmail, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'The email must be a valid email address' })
  email?: string;

  @ApiProperty({ example: 'Sakib Khan', required: false })
  @IsOptional()
  @IsString({ message: 'The name must be a string' })
  name?: string;

  @ApiProperty({ example: '+8801712345678', required: false })
  @IsOptional()
  @IsPhoneNumber('BD', {
    message:
      'The phone number must be a valid Bangladesh phone number (e.g., +8801...)',
  })
  phone?: string;
}
