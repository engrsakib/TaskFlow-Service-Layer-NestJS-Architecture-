import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import type { AuthUser } from '../auth/jwt.strategy';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // GET /api/v1/users/me
  @Get('me')
  getMe(@GetUser() user: AuthUser) {
    return this.userService.getMe(Number(user.id));
  }

  // GET /api/v1/users (ADMIN only)
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.userService.findAll();
  }

  // GET /api/v1/users/:id (ADMIN only)
  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // PATCH /api/v1/users/:id (self বা ADMIN — চাইলে পরে fine‑tune করতে পারো)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // PATCH /api/v1/users/:id/role (ADMIN only)
  @Patch(':id/role')
  @Roles('ADMIN')
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.userService.changeRole(id, dto);
  }

  // DELETE /api/v1/users/:id (ADMIN only)
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
