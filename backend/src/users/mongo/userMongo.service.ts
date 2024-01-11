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
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, userDto: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();

  }

  async findOneByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).select('id name email password role').exec();
  }
}
