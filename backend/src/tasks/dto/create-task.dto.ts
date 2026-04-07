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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Priority, Status } from '@prisma/client';
import { TaskPriority } from './task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix Bug #123' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Fix the login bug in production' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.PENDING })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
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
