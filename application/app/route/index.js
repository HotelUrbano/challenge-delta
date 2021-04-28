var express = require('express');
const ProductBLL = require('../controller/Products');

var router = express.Router();
const basicOptionsToBLL = { htmlResponse: true };

const internalError = (er, res) => {
    console.log(er);
    res.status(500).json({ errorText: "The server has an error! Try again later." })
}

router.get('/api/products', async (req, res) => {
    try{
        const product = new ProductBLL(basicOptionsToBLL);
        let productsList = await product.showProducts(req.query);
        res.status(productsList.status).json(productsList.response);
    }catch(er){
        internalError(er, res);
    }
});

router.get('/api/products/:productId', async (req, res) => {
    try{
        const product = new ProductBLL(basicOptionsToBLL);
        let productById = await product.showById(req.params.productId, req.query);
        res.status(productById.status).json(productById.response);
    }catch(er){
        internalError(er, res);
    }
});

router.post('/api/products', async (req, res) => {
    try{
        const product = new ProductBLL(basicOptionsToBLL);
        let addProduct = await product.addProduct(req.body);
        res.status(addProduct.status).json(addProduct.response);
    }catch(er){
        internalError(er, res);
    }
});

router.put('/api/products/:productId', async (req, res) => {
    try{
        const product = new ProductBLL(basicOptionsToBLL);
        let updProduct = await product.updateProduct(req.params.productId, req.body);
        res.status(updProduct.status).json(updProduct.response);
    }catch(er){
        internalError(er, res);
    }
});

router.delete('/api/products/:productId', async (req, res) => {
    try{
        const product = new ProductBLL(basicOptionsToBLL);
        let delProduct = await product.deleteProduct(req.params.productId);
        res.status(delProduct.status).json(delProduct.response);
    }catch(er){
        internalError(er, res);
    }
});

router.get('/crash', (req, res) => {    // USE THIS ROUTE IF IT IS THE ONLY OPTION TO STRESS THE POD 
    let i = 0;
    while(true){
        i++;
        console.log(i);
    }
    next();
});

module.exports = router