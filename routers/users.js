//const {User} = require('express');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    
    const userlist = await User.find().select('-passwordHash');

    if (!userlist) {
        return res.status(500).json({ success: false });
    }

    res.status(200).send(userlist);
    
});

router.post(`/login`, async (req,res)=>{
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if(!user){
        return res.status(400).json({
            success: false,
            message: 'The user not found'
        });
    }
    
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id
        },
        secret,
        {expiresIn : '1d'}
        )
        return res.status(200).json({user: user.email, token: token});
    }else{
        return res.status(400).json({success: false, message: 'password is wrong!'})
    }
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