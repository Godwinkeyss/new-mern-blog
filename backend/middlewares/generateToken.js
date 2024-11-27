import jwt from 'jsonwebtoken'

export const getToken = (user) =>{
    return jwt.sign({
        _id: user._id,
        email:user.email,
        username:user.username

    }, process.env.JWT_SECRET_KEY,{
        expiresIn:'5h'
    })
}

export const verifyToken = (req,res,next)=>{
    if(!req.headers.authorization) return res.status(403).send({message:'Not authorized. No token'})
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(" ")[1]
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data)=>{
            if (err) return res.status(403).send({message:'Wrong or expired token'})
            else{ 
             req.user = data;
             next()
            }
        })
    }
}