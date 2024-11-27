import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './controllers/auth.js'
import blogRouter from './controllers/blog.js'


const app = express()
dotenv.config()

app.use(express.json())

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('db connected successfully')
    }catch(err){
       console.log(err)
    }
}


app.use('/users',authRouter)
app.use('/blogs', blogRouter)


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`server running on http://127.0.0.1:${port}`)
    connectDb()
})

