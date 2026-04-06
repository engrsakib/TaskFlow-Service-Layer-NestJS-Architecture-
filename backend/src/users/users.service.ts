import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    console.log(user);

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.ensureExists(id);

    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
      },
    });
  }

  async changeRole(id: number, dto: ChangeRoleDto) {
    await this.ensureExists(id);

    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');
  }
}
