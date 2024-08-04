import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AssignManagerCommand } from './assign-mananger.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Logger } from '@nestjs/common';
import { EntityEventsDispatcher } from 'src/common/events/entity-events-dispatcher';

@CommandHandler(AssignManagerCommand)
export class AssignManagerHandler
  implements ICommandHandler<AssignManagerCommand, number>
{
  private readonly logger = new Logger(AssignManagerHandler.name);
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher,
  ) {}

  async execute(command: AssignManagerCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const employee = await db.findOne(Employee, {
        where: {
          id: command.id,
        },
      });
      if (!employee) {
        this.logger.error(`Employee with id ${command.id} not found`);
        return 0;
      }
      const manager = await db.findOne(Employee, {
        where: {
          id: command.managerId,
        },
      });
      if (!manager) {
        this.logger.error(`Manager with id ${command.managerId} not found`);
        return 0;
      }
      employee.managerId = manager.id;
      await db.save(Employee, employee);
      await this.eventDispatcher.dispatch(employee);
      return 1;
    });
  }
}
