import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMeetingDto } from './commands/create-meeting/create-meeting.dto';
import { plainToClass } from 'class-transformer';
import { CreateMeetingCommand } from './commands/create-meeting/create-meeting.command';
import { GetMeetingQuery } from './queries/get-meeting/get-meeting.query';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateMeetingDto) {
    const command = plainToClass(CreateMeetingCommand, dto);
    const id = await this.commandBus.execute(command);
    const query = plainToClass(GetMeetingQuery, { id: Number(id) });
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetMeetingQuery, { id: Number(id) });
    return await this.queryBus.execute(query);
  }
}
