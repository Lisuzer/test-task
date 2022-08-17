import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { User } from "src/user/schema/user.schema";
import { UserService } from "src/user/user.service";
import { UserInfo } from "./types/info.dto";
import { SignInUserDto } from "./dto/signin.dto";
import { SignUpUserDto } from "./dto/signup.dto";
import { Tokens } from "./types/tokens.type";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(signInDto: SignInUserDto): Promise<Tokens> {
        const user = await this.validateUser(signInDto);
        const tokens = await this.getTokens(user);
        await this.updateHashRt(user.id, tokens.refresh_token);
        return tokens;
    }

    async signUp(dto: SignUpUserDto): Promise<Tokens> {
        try {
            const isUser = await this.userService.findById(dto.id);
            if (isUser) {
                throw new BadRequestException('User with this id alredy exist');
            }
            dto.password = await this.hashData(dto.password);
            const newUser = await this.userService.createUser(dto);
            const tokens = await this.getTokens(newUser);
            await this.updateHashRt(newUser.id, tokens.refresh_token);
            return tokens;
        } catch (e) {
            return e.message;
        }
    }

    async updateHashRt(id: string, rt: string) {
        const hash = await this.hashData(rt);
        await this.userService.updateRt(id, hash);
    }

    async info({ user }: any): Promise<UserInfo> {
        try {
            const userMongo = await this.userService.findById(user.id);
            const { id, id_type } = userMongo;
            return { id, id_type };
        } catch (e) {
            return null;
        }
    }

    async logout({ user }: any, param: boolean):Promise<string> {
        return await this.userService.removeRt(user.id, param);
    }

    async hashData(data: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data, salt);
        return hashedPassword;
    }

    async getTokens(user: User): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({ id: user.id, id_type: user.id_type },
                {
                    expiresIn: 60 * 10,
                    secret: process.env.JWT_SECRET
                }),
            this.jwtService.signAsync({ id: user.id, id_type: user.id_type },
                {
                    expiresIn: 60 * 60 * 12,
                    secret: process.env.RT_SECRET
                }),
        ]);
        return {
            acces_token: at,
            refresh_token: rt
        };
    }

    async validateUser(signInDto: SignInUserDto): Promise<User> {
        const { id, password } = signInDto;
        const foundUser = await this.userService.findById(id);
        if (!foundUser) {
            throw new BadRequestException('Invalid id');
        }
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            throw new BadRequestException('Invalid password');
        }
        return foundUser;
    }

    async refreshToken({ user }: any): Promise<Tokens> {
        const dbUser = await this.userService.findById(user.id);
        if (!dbUser) {
            throw new ForbiddenException('Acces denied');
        }
        const rtMatches = await bcrypt.compare(user.refreshToken, dbUser.hashedRt);
        if (!rtMatches) {
            throw new ForbiddenException('Acces denied');
        }
        const tokens = await this.getTokens(dbUser);
        await this.updateHashRt(dbUser.id, tokens.refresh_token);
        return tokens;
    }
}