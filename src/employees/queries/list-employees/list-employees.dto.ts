import { Paginated } from 'nestjs-paginate';
import { Employee } from '../../entities/employee.entity';

export type ListEmployeesDto = Promise<Paginated<Employee>>;
