import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

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

    if (!user) throw new NotFoundException('User পাওয়া যায়নি');

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
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
      },
    });

    if (!user) throw new NotFoundException('User পাওয়া যায়নি');

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.ensureExists(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.email ? { email: dto.email } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
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

    return { message: 'User সফলভাবে ডিলিট হয়েছে' };
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User পাওয়া যায়নি');
  }
}
