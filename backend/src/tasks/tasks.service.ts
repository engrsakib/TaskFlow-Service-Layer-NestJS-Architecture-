import {
  BadRequestException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  type Role,
  type Task,
  Status,
  TaskPriority,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';

interface AuditDetails extends Prisma.JsonObject {
  changedBy?: number;
  field?: string;
  oldValue?: string | number | null;
  newValue?: string | number | null;
  title?: string;
  assignedTo?: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    const assignedUserId = Number(dto.assigneeId ?? userId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            title: dto.title,
            description: dto.description,
            status: (dto.status as Status) ?? Status.PENDING,
            priority: (dto.priority as TaskPriority) ?? TaskPriority.MEDIUM,
            user: {
              connect: { id: assignedUserId },
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        });

        const details: AuditDetails = {
          title: task.title,
          assignedTo: assignedUserId,
        };

        await tx.auditLog.create({
          data: {
            actionType: 'TASK_CREATED',
            actorId: userId,
            taskId: task.id,
            details: details as Prisma.InputJsonValue,
          },
        });

        return task;
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid assignee or task data provided');
      }

      throw new BadRequestException('Unable to create task');
    }
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
    const currentTask: Task = await this.findOne(id, userId, role);

    const data: Prisma.TaskUpdateInput = {};
    const logWrites: Prisma.PrismaPromise<any>[] = [];

    // 🔹 Title change (generic update log)
    if (dto.title !== undefined && dto.title !== currentTask.title) {
      data.title = dto.title;
      const details: AuditDetails = {
        field: 'title',
        oldValue: String(currentTask.title),
        newValue: String(dto.title),
      };

      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_UPDATED',
            actorId: userId,
            taskId: id,
            details: details as Prisma.InputJsonValue,
          },
        }),
      );
    }

    // 🔹 Description change (generic update log)
    if (
      dto.description !== undefined &&
      dto.description !== currentTask.description
    ) {
      data.description = dto.description;
      const details: AuditDetails = {
        field: 'description',
        oldValue: currentTask.description
          ? String(currentTask.description)
          : null,
        newValue: String(dto.description),
      };

      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_UPDATED',
            actorId: userId,
            taskId: id,
            details: details as Prisma.InputJsonValue,
          },
        }),
      );
    }

    // 🔹 Status change
    if (dto.status !== undefined && dto.status !== currentTask.status) {
      data.status = dto.status;
      const details: AuditDetails = {
        changedBy: userId,
        oldValue: String(currentTask.status),
        newValue: String(dto.status),
      };

      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_STATUS_CHANGED',
            actorId: userId,
            taskId: id,
            details: details as Prisma.InputJsonValue,
          },
        }),
      );
    }

    // 🔹 Priority change
    if (dto.priority !== undefined && dto.priority !== currentTask.priority) {
      data.priority = dto.priority;
      const details: AuditDetails = {
        changedBy: userId,
        oldValue: String(currentTask.priority),
        newValue: String(dto.priority),
      };

      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_PRIORITY_CHANGED',
            actorId: userId,
            taskId: id,
            details: details as Prisma.InputJsonValue,
          },
        }),
      );
    }

    // 🔹 Assignee change
    if (dto.assigneeId !== undefined && dto.assigneeId !== currentTask.userId) {
      data.user = { connect: { id: dto.assigneeId } };

      const details: AuditDetails = {
        changedBy: userId,
        oldValue: currentTask.userId,
        newValue: dto.assigneeId,
      };

      logWrites.push(
        this.prisma.auditLog.create({
          data: {
            actionType: 'TASK_ASSIGNEE_CHANGED',
            actorId: userId,
            taskId: id,
            details: details as Prisma.InputJsonValue,
          },
        }),
      );
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (logWrites.length > 0) {
      await this.prisma.$transaction(logWrites);
    }

    return updatedTask;
  }

  async remove(id: number, userId: number, role: Role) {
    const task = await this.findOne(id, userId, role);

    await this.prisma.$transaction(async (tx) => {
      await tx.task.delete({
        where: { id },
      });

      const details: AuditDetails = {
        title: task.title,
      };

      await tx.auditLog.create({
        data: {
          actionType: 'TASK_DELETED',
          actorId: userId,
          taskId: id,
          details: details as Prisma.InputJsonValue,
        },
      });
    });

    return { message: 'Task deleted successfully' };
  }

  private async ensureExists(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }
}
