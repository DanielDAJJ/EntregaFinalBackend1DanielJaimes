import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

/* const {Schema} = mongoose; */

const productSchema = new mongoose.Schema(
    {
        title: {type: String, unique: true},
        description: String,
        code: {type: Number, unique: true},
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        image: String
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(paginate);

export const productModel = mongoose.model(
    "productos",
    productSchema
)