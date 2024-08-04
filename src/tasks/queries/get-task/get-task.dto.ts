import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetTaskAssigneeDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
}

@Exclude()
export class GetTaskDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  assignee: GetTaskAssigneeDto;
}
