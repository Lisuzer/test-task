import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://user:user@cluster0.czlwfsq.mongodb.net/?retryWrites=true&w=majority`
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
