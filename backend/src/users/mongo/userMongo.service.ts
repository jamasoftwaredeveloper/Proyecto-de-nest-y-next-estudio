// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/userMongo.schema';


@Injectable()
export class UserMongoService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(userDto: any): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async update(id: string, userDto: any): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();

  }

  async findOneByEmailWithPassword(email: string) {
    return  await this.userModel.findOne({ email }).select('id name email password role type').exec();
  }
}
