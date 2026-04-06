import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'sakib@example.com' })
  @IsEmail({}, { message: 'Please Give me a Valid mail' })
  email!: string;

  @ApiProperty({ example: '1qazxsw2' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password!: string;
}
