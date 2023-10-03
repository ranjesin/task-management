import { IsString, MaxLength, MinLength  } from 'class-validator';

export class AuthCredentialsDto {

    @IsString()
    @MaxLength(20)
    @MinLength(4)
    username: string;

    @IsString()
    @MaxLength(15)
    @MinLength(8)
    password: string;
}