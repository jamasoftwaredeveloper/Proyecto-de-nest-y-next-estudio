// src/user/user.controller.ts
import { Controller, Post, Param, Body, Put } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionMongoService } from './sessionMongo.service';

@ApiTags('mongo-session')
@ApiBearerAuth()
// @Auth(Role.Admin)
@Controller('mongo/session')
export class SessionMongoController {
  constructor(private readonly sessionService: SessionMongoService) { }

  @Post()
  create(@Body() createUserDto: any) {
    return this.sessionService.create(createUserDto);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: any) {
    return this.sessionService.update(id, updateSessionDto);
  }


}
