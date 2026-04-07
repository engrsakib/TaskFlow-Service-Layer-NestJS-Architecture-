// dto/assign-task.dto.ts
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({ example: 2, description: 'User ID to assign the task to' })
  @IsInt()
  @Min(1)
  assigneeId!: number;
}
