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
import { TaskStatus } from './task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix Bug #123' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Fix the login bug in production' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: 2,
    description: 'User ID to assign the task to',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number;
}
