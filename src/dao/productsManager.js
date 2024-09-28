import { productModel } from "./models/productModel.js";

export class productsManager {
    static async getProducts() {
        return await productModel.find().lean();
    };
    static async getProductsPaginate(page=1, limit=10, sort={}, filter = {}){
        return await productModel.paginate(filter,{lean: true, page, limit, sort,});
    };
    static async getProductsBy(filtro={}){
        return await productModel.findOne(filtro).lean();
    };
    static async addProduct(product={}){
        const nuevoProducto = await productModel.create(product);
        return nuevoProducto.toJSON();
    };
    static async updateProduct(id, updatedProduct={}){
        return await productModel.findByIdAndUpdate(id, updatedProduct, {new: true}).lean();
    };
    static async deleteProduct(id){
        return await productModel.findByIdAndDelete(id,{new: true}).lean();
    };
}