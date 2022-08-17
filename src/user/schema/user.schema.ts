import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IdType } from './id-type.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: String, unique: true, required: true })
    @ApiProperty({
        example: 'random@example.com'
    })
    id: string;

    @Prop({ type: String, required: true })
    @ApiProperty({
        example: 'password'
    })
    password: string;

    @Prop({ enum: IdType, required: false })
    id_type: IdType;

    @Prop({ type: String, required: false })
    hashedRt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);