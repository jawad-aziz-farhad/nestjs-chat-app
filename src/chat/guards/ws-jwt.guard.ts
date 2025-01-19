import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {

    private readonly logger = new Logger(WsJwtGuard.name);

    constructor(private readonly jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient();
            const authToken = client.handshake.auth?.token?.split(' ')[1] || client.handshake?.headers?.authorization?.split(' ')[1] 
            
            if (!authToken) {
                throw new WsException('Unauthorized access.');
            }

            const payload = this.jwtService.verify(authToken);
            client.data.user = {...payload, _id: payload.sub};

            return true;
        } catch (error) {
            this.logger.error(`Unauthorized access`, error);
            throw new WsException('Unauthorized access.');
        }
    }
}