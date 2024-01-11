// src/user/user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {

    @Prop()
    origin: string;

    @Prop()
    method: string;

    @Prop()
    ip:string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
