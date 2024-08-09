const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/:id`,async (req,res)=>{
    const orderList = await Order.find();

    if(!orderList){
        return res.status(500).json({
            success: false,
            message: 'The orderList id not founnd'
        })
    }

    return res.status(200).send(orderList)
})