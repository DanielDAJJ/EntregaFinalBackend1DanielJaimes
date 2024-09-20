import { Router } from "express";
import { cartManager } from "../dao/cartManager.js";
import { isValidObjectId } from "mongoose";
import { productsManager } from "../dao/productsManager.js";

export const router = Router();

router.get('/', async (req, res) => {
    try {
        let cartProducts = await cartManager.getCartProducts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({cartProducts});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                message: error.message || 'Server Error',
                detalle: `${error.message}`
            }
        )
    }
});
router.get('/:id', async (req, res) => {
    let {id} = req.params;
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    };
    try {
        let cartProduct = await cartManager.getCartProductsById({_id:id});
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({cartProduct});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            message: error.message || 'Server Error',
            detalle: `${error.message}`
        })
    }
});
router.post('/', async (req, res) => {
    try {
        let cart = await cartManager.addProductToCart();
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({cart});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            message: error.message || 'Server Error',
            detalle: `${error.message}`
        })
    }
});
router.post('/:cid/product/:pid', async (req, res)=>{
    let {cid, pid} = req.params;
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    }
    try {
        let cart = await cartManager.getCartProductsById(cid);
        if(!cart){
            return res.status(404).json({message: 'Carrito no encontrado'});
        };
        let product = await productsManager.getProductsBy({_id:pid});
        if(!product){
            return res.status(404).json({message: 'Producto no encontrado'});
        };
        console.log(JSON.stringify(cart, null, 5));
        let indiceProducto = cart.productos.findIndex(p => p.product._id == pid);
        if(indiceProducto == -1){
            cart.productos.push({product: pid, quantity: 1});
        } else {
            cart.productos[indiceProducto].quantity++;
        }
        let resultado = await cartManager.updateCartProduct(cid, cart);
        if (resultado.modifiedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({message: "Cart actualizado"});
        } else {
            return res.status(404).json({message: 'No se ha modificado el carrito'});
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            message: error.message || 'Server Error',
            detalle: `${error.message}`
        })
    }

});
router.delete('/:id', async (req, res) => {
    let {id} = req.params;
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    };
    try {
        let carritoEliminado = cartManager.deleteCart(id);
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({carritoEliminado});        
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            message: error.message || 'Server Error',
            detalle: `${error.message}`
        })
    }
});
router.delete('/:cid/product/:pid', async (req, res) => {
    let {cid, pid} = req.params;
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    }
    try {
        let cart = await cartManager.getCartProductsById(cid);
        if(!cart){
            return res.status(404).json({message: 'Carrito no encontrado'});
        };
        let indiceProducto = cart.productos.findIndex(p=> p.id === pid);
        if(indiceProducto == -1){
            return res.status(404).json({message: 'Producto no encontrado en el carrito'});
        }
        if(cart.productos[indiceProducto].quantity > 1){
            cart.productos[indiceProducto].quantity--;
        } else {
            return cart.productos.splice(indiceProducto, 1);
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            message: error.message || 'Server Error',
            detalle: `${error.message}`
        })
    }
})