import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.DB_PREFIX}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`),
    AuthModule, 
    ChatModule, 
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
