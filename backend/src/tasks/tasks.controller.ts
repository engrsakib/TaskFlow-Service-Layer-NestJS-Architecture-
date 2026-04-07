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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RolesGuard, type Role } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { AuthUser } from '../auth/jwt.strategy';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  create(@GetUser() user: AuthUser, @Body() dto: CreateTaskDto) {
    return this.taskService.create(Number(user.id), dto);
  }

  @Get()
  @Roles('USER', 'ADMIN')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@GetUser() user: AuthUser, @Query() pagination: PaginationDto) {
    return this.taskService.findAll(Number(user.id), user.role, pagination);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  findOne(@Param('id') id: string, @GetUser() user: AuthUser) {
    return this.taskService.findOne(+id, Number(user.id), user.role);
  }

  @Patch(':id')
  @Roles('USER', 'ADMIN')
  update(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, Number(user.id), user.role, dto);
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  remove(@Param('id') id: string, @GetUser() user: AuthUser) {
    return this.taskService.remove(+id, Number(user.id), user.role);
  }
}
