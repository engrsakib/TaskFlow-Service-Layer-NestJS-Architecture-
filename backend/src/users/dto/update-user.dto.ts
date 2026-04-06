import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'email অবশ্যই valid হতে হবে' })
  email?: string;
}
