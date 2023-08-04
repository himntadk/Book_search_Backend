const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/book",{useUnifiedTopology: true, useNewUrlParser: true})
.then(()=>{
    console.log("connected to database!")
})
.catch((err)=>{
    console.log(err);
})