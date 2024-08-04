import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsNumber()
  assigneeId: number;
}
