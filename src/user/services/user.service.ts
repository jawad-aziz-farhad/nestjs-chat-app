import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ERROR_MESSAGE } from '../../config/constants';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createUserDto: CreateUserDto) {
      
    const { email, password } = createUserDto;
    try {
      const existingUser = await this.findOne('email', email);
      if (existingUser) {
        throw new UnauthorizedException('Email already exists.')
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.userModel.create({...createUserDto, password: hashedPassword})
    } catch (error) {
      throw new HttpException(ERROR_MESSAGE, HttpStatus.BAD_REQUEST)
    }
      
  }

  findAll(limit?: number, currentUserId?: string) {
    const query = currentUserId ? { _id: { $ne: currentUserId } } : {}
    return this.userModel.find(query).limit(limit || 30);
  }

  async findOne(key: string, value: string | number | boolean | Date) {
    return await this.userModel.findOne({[key]: value});
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
