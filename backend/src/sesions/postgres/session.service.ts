import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { Repository } from 'typeorm';

import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';


@Injectable()
export class SessionService {

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) { }

  async create(createSessionDto: CreateSessionDto) {
    return await this.sessionRepository.save(createSessionDto);
  }

  async update(id: number, updateUserDto: UpdateSessionDto) {
    return await this.sessionRepository.update(id, updateUserDto);

  }

}
