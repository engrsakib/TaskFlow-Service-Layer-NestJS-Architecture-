import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, userId },
    });
  }

  async findAll(userId: number, role: string, pagination: PaginationDto) {
    const { page, limit } = pagination;

    const where = role === 'ADMIN' ? {} : { userId };

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userId: number, role: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found');

    if (role !== 'ADMIN' && task.userId !== userId)
      throw new ForbiddenException('Not allowed');

    return task;
  }

  async update(id: number, userId: number, role: string, dto: UpdateTaskDto) {
    await this.findOne(id, userId, role);

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number, role: string) {
    await this.findOne(id, userId, role);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
