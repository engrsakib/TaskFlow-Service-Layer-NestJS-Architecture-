import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status, TaskPriority } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

const PrismaStatusEnum = Status as Record<string, Status>;
const PrismaTaskPriorityEnum = TaskPriority as Record<string, TaskPriority>;

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Fix Bug #123' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Fix the login bug in production' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.PENDING })
  @IsOptional()
  @IsEnum(PrismaStatusEnum)
  status?: Status;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(PrismaTaskPriorityEnum)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: 2,
    description: 'User ID to assign the task to',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number;
}
