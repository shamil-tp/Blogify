const Blog = require('../models/Blog')

exports.getBlog =async(req,res)=>{
    try{
        const blog = Blog.findOne({slug:req.params.slug})
        if(!blog){
            return res.status(400).json({
                message:'blog not found',
                success:false
        })
        }
        return res.status(200).json({
            blog:blog
        })
    }catch(e){
        return res.status(500).json({
            message:'sever error while fetching',
            success:false
        })
    }
}