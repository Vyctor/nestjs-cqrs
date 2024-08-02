import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListEmployeesQuery } from './list-employees.query';
import { ListEmployeesDto } from './list-employees.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@QueryHandler(ListEmployeesQuery)
export class ListEmployeesHandler
  implements IQueryHandler<ListEmployeesQuery, ListEmployeesDto>
{
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async execute(query: PaginateQuery): Promise<ListEmployeesDto> {
    return paginate(query, this.employeeRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['name', 'manager'],
      maxLimit: 10,
    });
  }
}
