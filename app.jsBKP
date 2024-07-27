const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

//middleware 
app.use(bodyParser.json())
app.use(morgan('tiny'));

/*app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))*/

const api = process.env.API_URL;
const dbConne = process.env.CONNECTION_STRING;

const Product = require('./models/product');

app.get(`${api}/products`,async (req,res)=>{
    // const product={
    //     id: 1,
    //     name: 'Hair dresser',
    //     image: 'some_url'
    // }
    // res.send(product)
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

app.post(`${api}/products`,(req,res)=>{
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })
    product.save().then((createdproduct =>{
        res.status(201).json(createdproduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
    
    // const product = req.body;
    
    // res.send(product)
})

mongoose.connect(dbConne,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    dbName : 'EShop-database'
}).then(()=>{
    console.log('database connection is ready');
}).catch((err)=>{
    console.log(err);
})

//this server will listen on the port and it will execute tthe fallback function when its successfull connected to the port
app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000/api/v1/products')
})

//mongodb+srv://chim4us:<password>@cluster0.dpdrlm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
