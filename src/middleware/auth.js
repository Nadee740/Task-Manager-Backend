const jwt=require('jsonwebtoken')
const User = require('../models/users')
const auth=async(req,res,next)=>{
    try{
        const token=req.header("Authorization").replace('Bearer ','')
        const decoded=jwt.verify(token,'nadeem')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
        //secret should be same for this ///////
    }catch(err){
        res.status(404).send({error:"Please authenticate"})
    }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTI5YjQyZDk5ZmEyNzIzNDBhOTVmYTgiLCJpYXQiOjE2MzAxMjM1NDZ9.ZldN0v16ZF3HF42X8S84fzYXPUAQXGnlrSc8_Q5aiaQ
module.exports=auth