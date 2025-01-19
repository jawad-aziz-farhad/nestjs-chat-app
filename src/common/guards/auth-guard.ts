import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return false;
        }

        try {
            await this.jwtService.verifyAsync(token);
            const decode = this.jwtService.decode(token);
            request.user = { _id: decode.sub };
            return true;
        } catch (error) {
            return false;
        }
    }
}