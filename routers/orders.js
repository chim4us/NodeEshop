const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');
//const authJwt = require('../helpers/jwt');  

router.get(`/`,async (req,res)=>{
    const orderList = await Order.find()
    .populate('user','name')
    .populate({ path: 'orderItems', populate: 'product'})
    .sort({'dateOrdered': -1});

    if(!orderList){
        return res.status(500).json({
            success: false,
            message: 'The orderList id not founnd'
        })
    }

    return res.status(200).send(orderList)
});

router.get(`/:id`,async (req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({ path: 'orderItems', populate: {path: 'product', populate : 'category'}});

    if(!order){
        return res.status(500).json({
            success: false,
            message: 'The order id not founnd'
        })
    }

    return res.status(200).send(order)
});

router.post(`/`, async (req,res)=>{

    const orderItemsIds = await Promise.all(
        req.body.orderItemsIds.map( async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity : orderItem.quantity,
                product: orderItem.product
            })

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        })
    );

    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(404).send('order cannot be saved');

    res.send(order);
});

router.put(`/:id`,async (req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,{
            status: req.body.status,
        }
    ,{
        new: true
    }
    );

    if(!order){
        return res.status(500).json({
            success: false,
            message: 'The order id not founnd'
        })
    }

    return res.status(200).send(order)
});

async function isAdmin(req, res, next) {
    console.log('req.auth:', req.auth);
    if (req.auth && req.auth.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied From Liquid' });
    }
}

//router.delete(`/:id`,authJwt(), isAdmin, async(req,res)=>{
router.delete(`/:id`, async(req,res)=>{
    Order.findByIdAndDelete(req.params.id).then(order =>{
        if(order){
            return res.status(200).json({
                success: true,
                message: 'The order deleted successfully'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'The order not found'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            message: err
        })
    })
})


module.exports = router;