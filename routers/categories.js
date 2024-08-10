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
    res.status(200).send(categoryList)
})

router.get(`/:id`,async (req,res)=>{
    const category = await Category.findById(req.params.id);

    if(!category){
        return res.status(500).json({
            success: false,
            message: 'The category id not founnd'
        })
    }

    return res.status(200).send(category)
})

router.put(`/:id`,async (req,res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    }
    ,{
        new: true
    }
    );

    if(!category){
        return res.status(500).json({
            success: false,
            message: 'The category id not founnd'
        })
    }

    return res.status(200).send(category)
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
    //
});

router.delete(`/:id`,async(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({
                success: true,
                message: 'The category deleted successfully'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'The category not found'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            message:err
        })
    })
})

module.exports = router;