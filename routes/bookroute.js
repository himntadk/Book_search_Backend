const express= require('express');
const routes = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const BookData = require('../model/bookmodel');

const date = new Date();

var storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"./uploads");
    },
    filename : function (req,file,cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({storage : storage});

routes.get('/',async(req,res)=>{
    res.render('index');
})
routes.get('/addbook',async(req,res)=>{
    const data = new BookData();
    res.render('books/addbook',{
        data : data
    });
})
routes.post('/createbook',upload.fields([{name : 'cover'},{name : 'book'}]), async(req,res)=>{
        const coverName = req.files['cover'] != null ? req.files['cover'][0].filename : null;
        const bookName = req.files['book'] != null ? req.files['book'][0].filename : null;
        const ifexist = await BookData.findOne({title : req.body.title});

    if(!ifexist && req.body.title!= null && req.body.title !== '' && req.body.author!= null && req.body.author !== ''){
        const storeData = new BookData({
            title : req.body.title,
            author : req.body.author,
            cover : coverName,
            book : bookName
        });
    try{
        await storeData.save();
        generateError(res,storeData,false);
     }
     catch(err){
        console.log(err);
        generateError(res,storeData,true);
     }
    }
    else if(!ifexist && (req.body.title === null || req.body.title === '')){
        const data = new BookData();
        res.render('books/addbook',{
            data : data,
            titleAbsenceMessage : 'The Book must have a title!'
        })
    }
    else if(!ifexist && (req.body.author === null || req.body.author === '')){
        const data = new BookData();
        res.render('books/addbook',{
            data : data,
            authorAbsenceMessage : 'The Book must have an author!'
        })
    }
    else{
        const data = new BookData();
        res.render('books/addbook',{
            data : data,
            existMessage : 'The Book already exists!'
        })
    }
})

routes.get('/getbook',async(req,res)=>{
  let query = BookData.find().sort({title : 'asc'});

  if(req.query.title != null && req.query.title !== '' ){
    query = query.regex('title',new RegExp(req.query.title,'i'));
  }

  try{
     const bookData = await query.exec();
     res.render('books/viewbook',{
        bookData : bookData,
        searchOption : req.query
     })
  }
  catch(err){
    console.log(err);
    res.redirect('/')
  }
})

routes.get('/readbook',async(req,res)=>{
    try{
    const bookData = await BookData.findOne({title : req.query.title});
    if(bookData){
        res.render('books/readbook',{
            bookData : bookData
        })
    }
   }
   catch(err){
      console.log(err);
      res.render('/')
   }
})

async function generateError(res,data,hasError = false){
    try{
       const params = {
         data : data
       }
       if(!hasError)
          params.successMessage = "Book has been inserted successfully!";
       else
          params.errorMessage = "Book could not be added!";
       res.render('books/addbook',params);
    }
    catch(err){
        console.log(err);
        res.redirect('/')
    }
}

module.exports = routes;