//const {User} = require('express');
const express = require('express');
const router = express.Router();


const {Product} = require('../models/product');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

router.get(`/`, async (req, res) => {
    
    const userlist = await User.find().select('-passwordHash');

    if (!userlist) {
        return res.status(500).json({ success: false });
    }

    res.status(200).send(userlist);
    
});

router.get(`/:id`,async (req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        return res.status(500).json({
            success: false,
            message: 'The category id not founnd'
        })
    }

    return res.status(200).send(user)
})

router.post(`/login`, async (req,res)=>{
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return res.status(400).json({
            success: false,
            message: 'The user not found'
        })
    }

    return res.status(200).send(user)
});

router.post(`/`,async(req,res)=>{
    //let passwordHash = await bcrypt.hashSync(req.body.password,10);
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('User cannot be created');

    return res.send(user);
})


module.exports = router;