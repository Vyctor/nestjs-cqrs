import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmployeeCommand } from './create-employee.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ContactInfo } from 'src/employees/entities/contact-info.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { EntityEventsDispatcher } from '../../../common/events/entity-events-dispatcher';

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler
  implements ICommandHandler<CreateEmployeeCommand, number>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher,
  ) {}
  async execute(command: CreateEmployeeCommand): Promise<number> {
    return await this.datasource.transaction(async (db) => {
      const contactInfo = db.create(ContactInfo, command.contactInfo ?? {});

      await db.save(contactInfo);

      const employee = db.create(Employee, {
        ...command,
        contactInfo,
      });
      await db.save(employee);
      await this.eventDispatcher.dispatch(employee);

      return employee.id;
    });
  }
}
