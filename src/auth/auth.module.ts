import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { User, UserSchema } from "src/user/schema/user.schema";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RtStrategy, AtStrategy } from "./strategies";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({}),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [AuthController],
    providers: [AuthService, AtStrategy, RtStrategy, UserService]
})
export class AuthModule { }