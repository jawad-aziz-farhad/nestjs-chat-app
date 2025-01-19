import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGE_SENDING_FAILED } from 'src/config/constants';
import { MessageDto } from '../dtos/message.dtos';
import { Message } from '../schemas/message.schema';

@Injectable()
export class ChatService {

    private readonly logger = new Logger(ChatService.name);

    constructor(@InjectModel(Message.name) private messageModel: Model<Message>){}

    async createMessage(messageDto: MessageDto) {
        try {
            const message = new this.messageModel({
                sender: messageDto.sender,
                recipient: messageDto.recipient,
                content: messageDto.content,
                room: messageDto.room || 'public'
            })
        
            return await message.save();
            
        } catch (error) {
            this.logger.error(`Message Saving in DB Failed: ${error}`)
            throw new HttpException(MESSAGE_SENDING_FAILED, HttpStatus.BAD_REQUEST)
        }    
    }

    async getMessages(sender: string, recipient: string): Promise<Message[]>{
        return this.messageModel
        .find({ 
                $or: [
                    { sender, recipient }, 
                    { sender: recipient, recipient: sender }
                ] 
            })
        .sort({ createdAt: 1})
        .limit(50)
        .populate('sender', 'username')
        .populate('recipient', 'username')
        .exec();
    }

    async markMessageAsRead(message: Partial<Message>): Promise<Message>{
        return this.messageModel.findByIdAndUpdate(
            { _id: message._id, recipient: message.recipient, isMessageRead: false }, 
            { isMessageRead: true, readAt: new Date() }, { new: true})
            .exec();
    }
}
