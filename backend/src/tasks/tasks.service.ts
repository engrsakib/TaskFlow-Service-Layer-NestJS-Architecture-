import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma, Role, Task } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    const assigneeId = dto.assigneeId ?? userId;

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        userId: assigneeId,
      },
    });
  }

  async findAll(userId: number, role: Role, pagination: PaginationDto) {
    const { page, limit } = pagination;

    const where: Prisma.TaskWhereInput = role === 'ADMIN' ? {} : { userId };

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

  async findOne(id: number, userId: number, role: Role): Promise<Task> {
    const task = await this.ensureExists(id);

    if (role !== 'ADMIN' && task.userId !== userId)
      throw new ForbiddenException('Not allowed');

    return task;
  }

  async update(id: number, userId: number, role: Role, dto: UpdateTaskDto) {
    const currentTask = await this.findOne(id, userId, role);

    const data: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.assigneeId !== undefined)
      data.user = { connect: { id: dto.assigneeId } };

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const logWrites: Prisma.PrismaPromise<unknown>[] = [];

    if (dto.status !== undefined && dto.status !== currentTask.status) {
      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_STATUS_CHANGED',
            actorId: userId,
            taskId: id,
            details: {
              changedBy: userId,
              oldValue: currentTask.status,
              newValue: dto.status,
            },
          },
        }),
      );
    }

    if (dto.priority !== undefined && dto.priority !== currentTask.priority) {
      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_PRIORITY_CHANGED',
            actorId: userId,
            taskId: id,
            details: {
              changedBy: userId,
              oldValue: currentTask.priority,
              newValue: dto.priority,
            },
          },
        }),
      );
    }

    if (logWrites.length > 0) {
      await this.prisma.$transaction(logWrites);
    }

    return updatedTask;
  }

  async remove(id: number, userId: number, role: Role) {
    await this.findOne(id, userId, role);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  private async ensureExists(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }
}
