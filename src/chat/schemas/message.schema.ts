import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Schema({ timestamps: true })
export class Message extends Model {

    _id: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: Types.ObjectId;
    
    @Prop({default: 'public'})
    room: string;

    @Prop({ type: String, required: true})
    content: string;

    @Prop({ default: false})
    isMessageRead: boolean;

    @Prop({})
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);