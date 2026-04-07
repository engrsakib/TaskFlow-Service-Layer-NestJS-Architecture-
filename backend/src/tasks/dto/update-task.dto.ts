import { ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

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
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    example: 2,
    description: 'User ID to assign the task to',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number;
}
