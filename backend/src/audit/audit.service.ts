import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditFilterDto } from './dto/audit-filter.dto';
import { AuditPaginationDto } from './dto/audit-pagination.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: AuditFilterDto, pagination: AuditPaginationDto) {
    const { page = 1, limit = 10 } = pagination;

    // 🔥 FIX: Strongly typed where clause
    const where: Prisma.AuditLogWhereInput = {};

    if (filter.actionType) {
      where.actionType = filter.actionType;
    }

    if (filter.actorId) {
      where.actorId = filter.actorId;
    }

    if (filter.taskId) {
      where.taskId = filter.taskId;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          actor: { select: { id: true, name: true, email: true } },
          task: { select: { id: true, title: true } },
        },
      }),

      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
