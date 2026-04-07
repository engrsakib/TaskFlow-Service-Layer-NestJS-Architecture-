// dto/create-task.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, TaskPriority } from '@prisma/client';

// Fix for Swagger + ESLint strict mode
const StatusEnum = Object.values(Status);
const TaskPriorityEnum = Object.values(TaskPriority);

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix Bug #123' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Fix the login bug in production' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: StatusEnum,
    default: Status.PENDING,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    enum: TaskPriorityEnum,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
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
