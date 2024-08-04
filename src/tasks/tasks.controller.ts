import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './commands/create-task/create-task.dto';
import { plainToClass } from 'class-transformer';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetTaskQuery } from './queries/get-task/get-task.query';
import { CreateTaskCommand } from './commands/create-task/create-task.command';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    const command = plainToClass(CreateTaskCommand, dto);
    const id = await this.commandBus.execute(command);
    const query = plainToClass(GetTaskQuery, { id: Number(id) });
    return await this.queryBus.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetTaskQuery, { id: Number(id) });
    return await this.queryBus.execute(query);
  }
}
