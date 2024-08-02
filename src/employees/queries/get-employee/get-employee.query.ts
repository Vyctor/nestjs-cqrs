import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from './../../../../node_modules/@nestjs/cqrs/dist/interfaces/queries/query-handler.interface.d';
import { EmployeeDto } from './employee.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { plainToClass } from 'class-transformer';
import { GetEmployeeQuery } from './get-employee.handler';

@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler
  implements IQueryHandler<GetEmployeeQuery, EmployeeDto>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(query: GetEmployeeQuery): Promise<EmployeeDto> {
    const data = await this.dataSource.manager.find(Employee, {
      where: {
        id: query.id,
      },
      relations: ['contactInfo'],
    });

    if (!data.length) return null;

    return plainToClass(EmployeeDto, data[0]);
  }
}
