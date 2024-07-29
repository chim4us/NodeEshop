const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.get(`/`,async (req,res)=>{
    const categoryList = await Category.find();
    if(!categoryList){
        res.status(500).json({
            success: false
        })
    }
    res.send(categoryList)
})

router.post(`/`,async(req,res)=>{
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    })
    category = await category.save();

    if(!category)
    return res.status(404).send('Category cannot be saved');

    res.send(category);

    // category.save().then((createdcategory =>{
    //     res.status(201).json(createdcategory)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
})

module.exports = router;