import { Schema, model } from "mongoose";

const nameCollection = 'Message'

const MessageSchema = new Schema({

    user: {type: String, required:[true, 'El nombre de usuario es requerido']},
    message: {type: String, required:[true, 'El message es requerido']}
});

MessageSchema.set('toJSON',{
    transform: function(doc, ret){
        delete ret.__v;
        delete ret._id;
        return ret;
    }
})

export const messageModel = model(nameCollection, MessageSchema)