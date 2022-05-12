const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task = require('./task')

const userSchema=new mongoose.Schema({
    name:{
type:String,
required:true,
trim:true
    },
    email:{
        unique:true,
        trim:true,
        lowercase:true,
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Please type valid mail")
            }
        }
    },
    password:{
        type:String,
   required:true,
   minlength:7,
trim:true,
validate(value){
    if(value.toLowerCase().includes("password")){
        throw new Error("Please type strong password")
    }
}
    },
    age:{
 default:0,       
type:Number,
validate(value){
    if(value<0){
        throw new Error("Age must be positive")
    }
}
    },
    tokens:[{
        token:{type:String,
        required:true
    }

    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true

}
)

userSchema.virtual('usertasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'user'
})



userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;
}
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'nadeem')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}
userSchema.statics.findByCredentials=async(email,password)=>{
    
    const user=await User.findOne({email})
    if(!user){
        
        throw new Error("unable to login")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
       
        throw new Error("unable to login")
    }
    
    return user
}
///hash plain text pass/////////////
userSchema.pre('save',async function (next){
      const user=this
      
      if(user.isModified('password')){
          user.password=await bcrypt.hash(user.password,8)
      }
      next()
})
//Delete user task when user is removed
userSchema.pre('remove',async function(next){
const user=this
await Task.deleteMany({user:user._id})
    next()
})

const User=mongoose.model('users',userSchema)

module.exports=User