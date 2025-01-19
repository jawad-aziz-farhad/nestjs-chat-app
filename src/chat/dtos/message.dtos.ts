import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class MessageDto {

    @IsString({ message: 'ID must be a string' })
    _id?: string;

    @IsNotEmpty({message: 'Recipient is required'})
    @IsString()
    recipient?: string;

    @IsNotEmpty({message: 'Recipient is required'})
    @IsString()
    sender?: string;

    @IsNotEmpty({ message: 'Message couldn\'t be empty.'})
    @IsString()
    content: string;

    @IsString({ message: 'Room value must be a string.'})
    room?: string;

    @IsDate()
    createdAt?: Date;
}