import { Router } from "express";
import { productsManager } from "../dao/productsManager.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

/* router.get('/', async (req, res) => {
    try {
        let Products = await productsManager.getProducts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({Products});
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
}); */
router.get('/', async (req, res) => {
    let {page, limit, sort, ...filters} = req.query;
    if (!page || isNaN(Number(page))) {
        page = 1;
    };
    if (!limit || isNaN(Number(limit))) {
        limit = 10;
    };
    if (sort) {
        let sortBy;
        if(sort.toLowerCase() === "asc" || sort == 1){
            sortBy = 1;
        } else if (sort.toLowerCase() === "desc" || sort == -1){
            sortBy = -1;
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid sort value` })
        }
        sort = {price: sortBy}
    };
    let filter ={};
    Object.keys(filters).forEach(key => {
        const keyLower = key.toLowerCase();
        if(keyLower === 'category'){
            filter[keyLower] = { $regex: filters[key], $options: 'iu' }
        }
    });
    try {
        let product = await productsManager.getProductsBy(filter);
        if(!product){
            return res.status(404).json({message: 'Categoria no encontrada'});
        };
        let products = await productsManager.getProductsPaginate(page, limit, sort, filter);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({...products});
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
    try {
        let product= await productsManager.getProductsBy({_id:id});
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({product});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json(
            {
                message: 'No se encontró el producto',
                detalle: `${error.message}`
            }
        )
    }
});
router.post('/', async (req, res) => {
    let {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        image
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({error:'completa los campos de title, description, code, price, stock y category'})
    };
    try {
        let productExist = await productsManager.getProducts();
        if (productExist.some(p => p.code === code || p.title === title)) {
            return res.status(400).json({error: 'Este producto ya existe'})
        };
        let newProduct = await productsManager.addProduct({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            image
        });
        req.io.emit('newProduct', newProduct)
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({product: newProduct});
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
router.put("/:id", async (req, res) => {
    let {id} = req.params;
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    };
    let update = req.body;
    try {
        let updateProduct = await productsManager.updateProduct(id, update);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({product: updateProduct});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                message: error.message || 'Server Error',
                detalle: `${error.message}`
            }
        )
    };
});
router.delete('/:id', async (req, res) => {
    let {id} = req.params;
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: 'Id invalido'});
    };
    try {
        let deleteProduct = await productsManager.deleteProduct(id);
        req.io.emit('deleteProduct', deleteProduct);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message: 'Producto eliminado correctamente', deleteProduct});
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
})