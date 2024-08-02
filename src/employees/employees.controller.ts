import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetEmployeeQuery } from './queries/get-employee/get-employee.handler';
import { plainToClass } from 'class-transformer';
import { CreateEmployeeDto } from './commands/create-employee/create-employee.dto';
import { CreateEmployeeCommand } from './commands/create-employee/create-employee.command';
import { UpdateEmployeeDto } from './commands/update-employee/update-employee.dto';
import { UpdateEmployeeCommand } from './commands/update-employee/update-employee.command';
import { AssignManagerDto } from './commands/assign-manager/assign-manager.dto';
import { AssignManagerCommand } from './commands/assign-manager/assign-mananger.command';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    const command = plainToClass(CreateEmployeeCommand, dto);
    const id = await this.commandBus.execute(command);
    const query = plainToClass(GetEmployeeQuery, { id: Number(id) });
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetEmployeeQuery, { id: Number(id) });
    const employee = await this.queryBus.execute(query);

    if (!employee) {
      throw new NotFoundException();
    }

    return employee;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    const command = plainToClass(UpdateEmployeeCommand, {
      ...dto,
      id: Number(id),
    });
    const affectedRows = await this.commandBus.execute(command);
    if (affectedRows === 0) {
      throw new NotFoundException();
    }
    const query = plainToClass(GetEmployeeQuery, { id: Number(id) });
    return this.queryBus.execute(query);
  }

  @Patch(':id/assign-manager')
  async assignManager(@Param('id') id: string, @Body() dto: AssignManagerDto) {
    const command = plainToClass(AssignManagerCommand, {
      ...dto,
      id: Number(id),
    });
    const affectedRows = await this.commandBus.execute(command);
    if (affectedRows === 0) {
      throw new NotFoundException();
    }
    const query = plainToClass(GetEmployeeQuery, { id: Number(id) });
    return this.queryBus.execute(query);
  }
}
