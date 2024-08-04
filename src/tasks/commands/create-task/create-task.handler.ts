import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { NotFoundException } from '@nestjs/common';
import { Task } from 'src/tasks/entities/task.entity';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler
  implements ICommandHandler<CreateTaskCommand, number>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}
  async execute(command: CreateTaskCommand): Promise<number> {
    return await this.datasource.transaction(async (db) => {
      const assignee = await db.findOne(Employee, {
        where: {
          id: command.assigneeId,
        },
      });

      if (!assignee) {
        throw new NotFoundException('Invalid assignee');
      }
      const task = db.create(Task, {
        assignee,
        name: command.name,
      });
      await db.save(task);
      return task.id;
    });
  }
}
