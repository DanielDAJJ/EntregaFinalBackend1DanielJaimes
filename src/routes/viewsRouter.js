import { Router } from "express";
import { productsManager } from "../dao/productsManager.js";

export const router = Router();

router.get('/', async (req, res) => {
    /* let products = await productsManager.getProducts(); */
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
});