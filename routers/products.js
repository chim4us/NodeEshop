const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');

router.get(`/`,async (req,res)=>{
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

router.post(`/`,async(req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(500).json({error: 'category id cannot be found',success: false});

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    let createdproduct = await product.save();
    if(createdproduct)
        return res.status(201).json(createdproduct);

        return res.status(500).json({
            error: 'Product cannect be created',
            success: false
        });
    // product.save().then((createdproduct =>{
    //     res.status(201).json(createdproduct)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
})

module.exports = router;