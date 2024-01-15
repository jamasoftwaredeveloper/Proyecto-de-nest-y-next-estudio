// src/user/user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

@Schema()
export class User extends Document {

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, enum: Role, default: Role.Admin })
    role: Role;

    @Prop({ default: "web" })
    type: string;

    @Prop({ type: Date, default: null })
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
