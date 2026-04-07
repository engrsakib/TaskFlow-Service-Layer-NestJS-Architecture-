import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserId, UserRole } from '../../common/decorators/user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  create(@UserId() userId: number, @Body() dto: CreateTaskDto) {
    return this.taskService.create(userId, dto);
  }

  @Get()
  @Roles('USER', 'ADMIN')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @UserId() userId: number,
    @UserRole() role: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.taskService.findAll(userId, role, pagination);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  findOne(
    @Param('id') id: string,
    @UserId() userId: number,
    @UserRole() role: string,
  ) {
    return this.taskService.findOne(+id, userId, role);
  }

  @Patch(':id')
  @Roles('USER', 'ADMIN')
  update(
    @Param('id') id: string,
    @UserId() userId: number,
    @UserRole() role: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, userId, role, dto);
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  remove(
    @Param('id') id: string,
    @UserId() userId: number,
    @UserRole() role: string,
  ) {
    return this.taskService.remove(+id, userId, role);
  }
}
