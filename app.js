const express = require('express');
const bodyParser = require('body-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');
const app= express();


app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.set('layout','layouts/layout');
app.use(express.static('uploads'));
app.use(expressEjsLayouts);
app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT || 5900;

require("./connection/connect");
const BookRoutes = require('./routes/bookroute');

app.use("/",BookRoutes);

app.listen(port,()=>{
    console.log("listening...")
})

