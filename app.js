const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

app.use(cors());
app.options('*',cors());

const api = process.env.API_URL;
const dbConne = process.env.CONNECTION_STRING;

//middleware 
app.use(bodyParser.json())
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//

//Routers
const productsRouter = require('./routers/products');
const categoriesRoutes = require('./routers/categories');
const usersRoutes = require('./routers/users');
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);


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
