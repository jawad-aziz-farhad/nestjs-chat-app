import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateUserDto {

    @IsString()
    _id: ObjectId;

    @IsNotEmpty({ message: 'Username is required.'})
    @IsString({ message: 'Username must be a string.'})
    username: string;

    @IsNotEmpty({ message: 'Email is required.'})
    @IsString({ message: 'Email must be a string.'})
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Email must be a valid email address.' })
    email: string;

    @IsNotEmpty({ message: 'Password is required.'})
    @IsString({ message: 'Password must be a string.'})
    // @Min(6, { message: 'Password must contain 8 letters (Alphabets, Special Characters'})
    password: string;




}
