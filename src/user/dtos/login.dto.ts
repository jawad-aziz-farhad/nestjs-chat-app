import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsNotEmpty({ message: 'Username is required.'})
    @IsString({ message: 'Username must be a string.'})
    email: string;

    @IsNotEmpty({ message: 'Password is required.'})
    @IsString({ message: 'Password must be a string.'})
    // @Min(6, { message: 'Password must contain 8 letters (Alphabets, Special Characters'})
    password: string;

}
