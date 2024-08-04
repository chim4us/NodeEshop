const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');

// router.get(`/`,async (req,res)=>{
//     let filter = {};
//     if(req.query.categories){
//         filter = {category: req.query.categories.split(',')}
//     }
//     //with this your returning everything on the database
//     //const productList = await Product.find();

//     //with this your returning everything on the database
//     //const productList = await Product.find({...filter}).populate('category');
//     const productList = await Product.find({filter});

//     //to select only specified fields. with -_id your excluding the id
//     //const productList = await Product.find().select('name image -_id').populate('category');
//     if(!productList){
//         res.status(500).json({
//             success: false
//         })
//     }
//     res.status(200).send(productList)
// })

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        try {
            const categoryIds = req.query.categories.split(',').map(id => mongoose.Types.ObjectId(id));
            filter = { category: { $in: categoryIds } };
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid category IDs provided.' });
        }
    }

    try {
        const productList = await Product.find(filter).populate('category');

        if (!productList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).send(productList);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get(`/:id`,async (req,res)=>{
    //only populate the product details also
    //const product = await Product.findById(req.params.id);

    //to populate the category details also
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        return res.status(500).json({
            success: false,
            message: 'The product id not founnd'
        })
    }

    return res.status(200).send(product)
})

router.get(`/get/count`,async (req,res)=>{
    try{
        const productCount = await Product.countDocuments();
        //for production use below to count the product that are not deleted
        //const productCount = await Product.countDocuments({del_flg:true});

        if (productCount === null) {
            return res.status(500).json({
                success: false
            });
        }
    
        res.status(200).send({ productCount: productCount });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
    
});

router.get(`/get/featured/:count`,async (req,res)=>{
    const count = req.params.count ? req.params.count : 0;
    try{
        const products = await Product.find({isFeatured:true}).populate('category').limit(+count);

        if (products === null) {
            return res.status(500).json({
                success: false
            });
        }
    
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
    
});

router.put(`/:id`,async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        //res.status(400).send('invalid product id');
        res.status(400).json({error: 'invalid product id',success: false})
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).json({error: 'category id cannot be found',success: false});

    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    }
    ,{
        new: true
    }
    );

    if(!product)
        return res.status(500).send('The product cannotbe update!')
    

    return res.status(200).send(product)
});

router.delete(`/:id`,async(req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({
                success: true,
                message: 'The product deleted successfully'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'The product not found'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            message:err
        })
    })
});

router.post(`/`,async(req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).json({error: 'category id cannot be found',success: false});

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
});

module.exports = router;