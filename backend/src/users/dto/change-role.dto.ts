import { IsEnum } from 'class-validator';
import type { Role } from '../../auth/roles.guard';

export class ChangeRoleDto {
  @IsEnum(['USER', 'ADMIN'], {
    message: 'role অবশ্যই USER বা ADMIN হতে হবে',
  })
  role!: Role;
}
