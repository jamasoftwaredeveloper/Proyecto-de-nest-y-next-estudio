// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from 'inspector';
import { Model } from 'mongoose';



@Injectable()
export class SessionMongoService {
  constructor(@InjectModel(Session.name) private readonly userModel: Model<Session>) { }

  async create(userDto: any): Promise<Session> {
    const createdSession = new this.userModel(userDto);
    return createdSession.save();
  }

  async update(id: string, userDto: any): Promise<Session | null> {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

}
