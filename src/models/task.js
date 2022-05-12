const mongoose=require('mongoose')

const Taskschema=new mongoose.Schema({
    desc:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        default:false,
        type:Boolean
    },
    user:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
}
},{
    timestamps:true
})

const Task=mongoose.model("Tasks",Taskschema)
module.exports=Task