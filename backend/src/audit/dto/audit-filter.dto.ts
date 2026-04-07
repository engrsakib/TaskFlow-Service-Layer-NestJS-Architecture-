import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AuditFilterDto {
  @ApiPropertyOptional({ example: 'TASK_CREATED' })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  actorId?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  taskId?: number;
}
