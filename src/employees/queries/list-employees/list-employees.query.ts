import { PaginateQuery } from 'nestjs-paginate';

export class ListEmployeesQuery implements PaginateQuery {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  select?: string[];
  path: string;
}
