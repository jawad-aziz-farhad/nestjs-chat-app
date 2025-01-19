import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class User extends Document {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, min: 6})
    password: string;

    @Prop({ default: false })
    isOnline: boolean;

    @Prop({ default: Date.now()})
    lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);