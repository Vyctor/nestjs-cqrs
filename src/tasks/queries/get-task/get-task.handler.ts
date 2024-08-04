import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskQuery } from './get-task.query';
import { GetTaskDto } from './get-task.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery, GetTaskDto> {
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async execute(query: GetTaskQuery): Promise<GetTaskDto> {
    const data = await this.datasource.manager.findOne(Task, {
      where: {
        id: query.id,
      },
      relations: ['assignee'],
      select: {
        id: true,
        name: true,
        assignee: {
          id: true,
          name: true,
        },
      },
    });
    if (!data) throw new NotFoundException(`Task ${query.id} not found`);

    return plainToClass(GetTaskDto, data);
  }
}
