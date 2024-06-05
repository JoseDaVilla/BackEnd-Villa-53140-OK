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
    rol: {
        type: String, default: "user", enum: ["admin", "user"]
    },
}));
