import { Controller, Get, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetEmployeesReportQuery } from './queries/get-employees-reports/get-employees-report.query';

@Controller('reports')
export class ReportsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('employees')
  async getEmployeesReport() {
    const query = new GetEmployeesReportQuery();
    const report = await this.queryBus.execute(query);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }
}
