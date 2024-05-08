import { Schema, model } from "mongoose";

const nameCollection = 'Product'

const ProductSchema = new Schema({
    
    title:{type:String, required:[true, 'El title del producto es obligatorio'], },
    description:{type:String, required:[true, 'La description del producto es obligatorio'], },
    price:{type: Number , required:[true, 'El price del producto es obligatorio'], },
    code:{type: String, required:[true, 'El code del producto es obligatorio'], unique: true },
    stock:{type: Number, required:[true, 'El stock del producto es obligatorio'], },
    category:{type:String, required:[true, 'El category del producto es obligatorio'], },
    status:{type: Boolean, default: true },
    thumbnails: [{type: String}]
});

ProductSchema.set('toJSON',{
    transform: function(doc, ret){
        delete ret.__v;
        return ret;
    }
})

export const productModel = model(nameCollection, ProductSchema)