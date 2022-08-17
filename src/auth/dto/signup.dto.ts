import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsEmailOrPhone } from "../validator/is-email-or-phone.validator";

export class SignUpUserDto {
    @ApiProperty({
        description: 'phone or email',
        required: true,
        default: 'random@example.com'
    })
    @IsEmailOrPhone({ message: 'Provided id is not valid' })
    id: string;

    @ApiProperty({
        description: 'user password',
        required: true,
        default: 'password'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}