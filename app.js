const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());

//const api = process.env.API_URL;
const dbConne = process.env.CONNECTION_STRING;

//middleware 
app.use(bodyParser.json())
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routers
const productsRouter = require('./routers/products');
const categoriesRoutes = require('./routers/categories');
const usersRoutes = require('./routers/users');
//const ordersRoutes = require('./routers/orders');
const ordersRoutes = require('./routers/orders');

const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


mongoose.connect(dbConne,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    dbName : 'EShop-database'
}).then(()=>{
    console.log('database connection is ready');
}).catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000/api/v1/products')
})
