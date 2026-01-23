const mongoose = require('mongoose')

const blogSchema =new mongoose.Schema(
    {
        title:{
            type:String,
            trim:true
        },
        slug:{
            type:String,
            trim:true
        },
        id:String,
    },
    {   timestamps:true   }

)

module.exports = mongoose.model('Blog',blogSchema)