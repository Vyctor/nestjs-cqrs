import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEmployeeCommand } from './update-employee.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Employee } from '../../../employees/entities/employee.entity';
import { EntityEventsDispatcher } from 'src/common/events/entity-events-dispatcher';

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeHandler
  implements ICommandHandler<UpdateEmployeeCommand, number>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher,
  ) {}

  async execute(command: UpdateEmployeeCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const employee = await db.findOne(Employee, {
        where: {
          id: command.id,
        },
        relations: ['contactInfo'],
      });
      if (!employee) {
        return 0;
      }
      db.merge(Employee, employee, command);
      await db.save(Employee, employee);
      await this.eventDispatcher.dispatch(employee);
      return 1;
    });
  }
}
