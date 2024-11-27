import express from 'express'
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { getToken } from '../middlewares/generateToken.js';

const authRouter = express.Router()

authRouter.post('/register', async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).send({message:'All fields are required'})
        }
        const isUserExist = await User.findOne({username: username, email: email})
            if(isUserExist){
                return res.status(400).send({message:'User already exist'})
            }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)
        const newUser = new User({username, email, password:hashedPassword})
        const user = await newUser.save()
        res.status(201).send({
            _id:user._id,
            username:user.username,
            email:user.email,
            token: getToken(user)
        })
    } catch (error) {
        console.log(error.message)
       return res.status(500).send({message:'Internal Server Error', error}) 
    }
})

authRouter.post('/login',async(req, res)=>{
    const {email, password} = req.body

    try {
       const user = await User.findOne({email})
       if(user && await bcrypt.compare(password, user.password)){
        res.send({
            _id: user._id,
            username:user.username,
            token:getToken(user)
        })
       }else{
        return res.status(401).send({message:'Invalid email or password'})
       }
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:'Internal Server Error', error})  
    }
})



export default authRouter