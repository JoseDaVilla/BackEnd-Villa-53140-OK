import mongoose from 'mongoose';

export const userModel = mongoose.model('usuarios', new mongoose.Schema({
    nombre: String,
    email: {
        type: String, unique: true
    },
    password: String,
    age: Number,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    rol: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [
        {
            name: { type: String },
            reference: { type: String }
        }
    ],
    last_connection: Date,
}));
