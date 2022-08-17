import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpUserDto } from 'src/auth/dto/signup.dto';
import { IdType } from './schema/id-type.enum';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    getIdType(id: string): IdType {
        const regExp = RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
        if (regExp.test(id)) {
            return IdType.EMAIL;
        }
        return IdType.PHONE;
    }

    async findById(id: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ id });
            if (!user) {
                throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (e) {
            return null;
        }
    }

    async createUser(dto: SignUpUserDto): Promise<User> {
        try {
            const id_type = this.getIdType(dto.id)
            const user = new this.userModel({ ...dto, id_type });
            await user.save();
            return user;
        } catch (e) {
            return null;
        }
    }

    async updateRt(id: string, rt: string): Promise<User> {
        try {
            return await this.userModel.findOneAndUpdate({ id }, { hashedRt: rt });
        } catch (e) {
            return null;
        }
    }

    async removeRt(id: string, param: boolean): Promise<string> {
        const toUpdate = [
            { ...(param ? { hashedRt: { $ne: null } } : { id }) },
            { hashedRt: null }
        ];
        try {
            await this.userModel.updateMany(...toUpdate);
            return param ? "All user tokens have been removed" : "User token has been removed";
        } catch (e) {
            return null;
        }

    }
}
