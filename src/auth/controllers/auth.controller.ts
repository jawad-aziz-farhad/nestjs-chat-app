import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { LoginDto } from '../../user/dtos/login.dto';
import { AuthService } from '../services/auth/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('/sign-up')
    async register(@Body(ValidationPipe) payload: CreateUserDto) {
        const user = await this.authService.create(payload);
        return user;
    }

    @Post('/sign-in')
    async signIn(@Body(ValidationPipe) loginDto: LoginDto) {
        const user = await this.authService.login(loginDto);
        return user;
    }

}
