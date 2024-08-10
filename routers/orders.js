const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');

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

// router.post(`/`, async (req, res) => {
//     console.log("newOrderItem");
    
//     try {
//         const orderItemsIds = await Promise.all(req.body.orderItemsIds.map(async (orderItem) => {
//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 product: orderItem.product
//             });

//             newOrderItem = await newOrderItem.save();
//             console.log(newOrderItem);
//             return newOrderItem._id;
//         }));

//         let order = new Order({
//             orderItems: orderItemsIds,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: req.body.status,
//             totalPrice: req.body.totalPrice,
//             user: req.body.user,
//         });

//         order = await order.save();

//         if (!order) {
//             return res.status(404).send('Order cannot be saved');
//         }

//         res.send(order);
//     } catch (error) {
//         res.status(500).send('An error occurred while creating the order: ' + error.message);
//     }
// });


module.exports = router;