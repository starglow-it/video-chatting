import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetLinkRequest {
    @IsNotEmpty({
        message: 'Token must be present',
    })
    @IsString({
        message: 'Invalid token value',
    })
    @IsEmail({ message: 'Invalid email value '})
    @ApiProperty()
    readonly email: string;
}
