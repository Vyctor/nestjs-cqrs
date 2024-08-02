import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { DeleteEmployeeCommand } from './delete-employee.command';

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeHandler
  implements ICommandHandler<DeleteEmployeeCommand, number>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async execute(command: DeleteEmployeeCommand): Promise<number> {
    return await this.datasource.transaction(async (db) => {
      const employee = await db.findOne(Employee, {
        where: {
          id: command.id,
        },
      });

      if (!employee) return 0;

      await db.delete(Employee, employee);

      return 1;
    });
  }
}
