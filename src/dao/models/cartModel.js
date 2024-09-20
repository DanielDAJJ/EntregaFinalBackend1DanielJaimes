import mongoose from "mongoose";
/* const {Schema} = mongoose; */

const cartSchema = new mongoose.Schema(
    {
        productos:{
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: "productos"
                    }, 
                    quantity: Number
                }
            ]
    }
    },
    {
        timestamps: true
    }
);
cartSchema.pre('findOne', function () {
    this.populate(`productos.product`).lean();
})
export const cartModel = mongoose.model(
    "carritos",
    cartSchema
);