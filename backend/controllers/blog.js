import express from 'express'
import Blog from '../models/Blog.js'
import mongoose from 'mongoose'
import { verifyToken } from '../middlewares/generateToken.js';
const blogRouter = express.Router()


blogRouter.get('/getAll', async(req,res)=>{
   try{
     const blogs = await Blog.find({}).populate('userId', '-password')
     res.status(200).send(blogs)
   }catch(err){
     res.status(500).send({message:'Somethng went wrong', err})
   }
})


blogRouter.get('/find/:id',async(req, res)=>{
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Blog not found' });
    }
    try{
      const blog = await Blog.findById(req.params.id).populate('userId', '-password')
      if(!blog){
        res.status(404).send({message:'blog not found'})
      }
      blog.views +=1
      await blog.save()
        res.status(200).send(blog) 
      
    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err}) 
    }
})

blogRouter.get('/featured', async(req,res)=>{
    try{
        const blogs =await Blog.find({featured:true}).populate('userId').limit(4)
        res.status(200).send(blogs)

    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err}) 
    }
})

blogRouter.post('/', verifyToken, async(req,res)=>{
    try{
        const blog = await Blog.create({...req.body, userId:req.user._id})
        console.log(req.user.id)
        return res.status(200).send(blog)

    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err})
    }
})

blogRouter.put('/update/:id',verifyToken, async(req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Blog not found' });
    }
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.userId.toString() !== req.user._id.toString()) {
            console.log(blog.userId, req.user._id)
        throw new Error('You can only update your own blog')
        }
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true}).populate('userId', '-password')
        if(!updatedBlog){
            return res.status(404).send({message:'Blog not found'})
        }
        res.status(200).send(updatedBlog)
        
    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err})
    
    }
})

blogRouter.put('/likes/:id', verifyToken, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Blog not found' });
    }
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.likes.includes(req.user._id)){
            blog.likes = blog.likes.filter((userId) => userId !== req.user._id)
            return res.status(200).send({message:'you have successfully unlike the blog',blog})
        }
        blog.likes.push(req.user._id)
        await blog.save()
        res.status(200).send({message:'successfully liked the blog',blog})
    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err})
        //test
    }
})

blogRouter.delete('/delete/:id', verifyToken, async(req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Blog not found' });
    }
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.userId.toString() !== req.user._id.toString()) {
            throw new Error('You can only delete your own blog')
        }
        await Blog.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Blog deleted successfully'})
        
    }catch(err){
        console.log(err.message)
        res.status(500).send({message:'Somethng went wrong', err})
    
    }
})




export default blogRouter;

