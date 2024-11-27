import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    title:{
        type:String,
        required:true,
        min:4,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
      type:String,
      required:true
    },
    featured:{
     type:Boolean,
     default:false
    },
    likes:{
        type:[String],
        default:[]
    },
    views:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog