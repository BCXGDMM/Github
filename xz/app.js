const express=require('express');
const pool=require('./pool.js');
const bodyParser=require('body-parser');
const userRouter=require('./routes/user.js');
const productRouter=require('./routes/product.js');
var app=express();
app.listen(8080);
app.use(bodyParser.urlencoded({extended:false}));

//托管静态资源
app.use(express.static('./public'));
app.use('/user',userRouter);
app.use('/product',productRouter);