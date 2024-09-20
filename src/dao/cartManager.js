import { cartModel } from "./models/cartModel.js";

export class cartManager {
    static async getCartProducts(){
        return await cartModel.find().lean();
    };
    static async getCartProductsById(id) {
        return await cartModel.findOne({_id:id});
    };
    static async addProductToCart() {
        return await cartModel.create({productos: []})
    };
    static async updateCartProduct(id, cartProduct) {
        return await cartModel.updateOne({_id:id}, cartProduct)
    };
    static async removeProductFromCart(id, cartProduct) {
        return await cartModel.deleteOne({_id:id}, cartProduct)
    };
    static async deleteCart(id){
        return await cartModel.findByIdAndDelete(id);
    }
}
