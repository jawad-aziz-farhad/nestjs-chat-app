import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ERROR_MESSAGE } from '../../../config/constants';
import { CreateUserDto } from '../../../user/dtos/create-user.dto';
import { LoginDto } from '../../../user/dtos/login.dto';
import { User } from '../../../user/schemas/user.schema';
import { UserService } from '../../../user/services/user.service';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private userModel: Model<User>, 
  private jwtService: JwtService, private userService: UserService){}
  
  async create(createUserDto: CreateUserDto) {
    
    const { email, password } = createUserDto;
    try {
      
      const newUser = await this.userService.create({...createUserDto})
      
      const token = this.createToken(newUser)
      const { _id, username } = newUser;
      return {token, user: {_id, email, username}};
    } catch (error) {
      throw new HttpException(ERROR_MESSAGE, HttpStatus.BAD_REQUEST)
    }
    
  }

  async login(loginDto: LoginDto) {
    const { email: _email, password } = loginDto;

    try {
      const user = await this.userService.findOne('email', _email);

      if (!user) {
        throw new UnauthorizedException('No user found with provided email');
      }

      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        throw new UnauthorizedException('One of the provided details are not correct.')
      }
      
      const token = this.createToken(user)
      const { _id, email, username } = user;
      return {token, user: {_id, email, username}};

    } catch (error) {
      throw new UnauthorizedException('Not authorised.');
    }
    
  }

  createToken(user){
    
    const payload = {
        sub: user._id,
        username: user.username
      };
    return this.jwtService.sign(payload);
      
  }   
}
    

