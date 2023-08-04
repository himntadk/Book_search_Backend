const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required : true,
        unique : true
    },
    author: {
        type: String,
        required : true
    },
    cover : String,
    book : String
})

module.exports = mongoose.model('bookdata',BookSchema);