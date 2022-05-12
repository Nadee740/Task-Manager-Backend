const express=require('express');
const auth = require('../middleware/auth');
const router=express.Router()
const Task=require('../models/task')
router.post("/tasks",auth,async (req, res) => {
    const task = new Task({
      ...req.body,
      user:req.user._id
    });
    try{
   await task.save()
   res.status(200).send(task)
    }catch(err){
      res.status(400).send(err)
    }
  });
  
  router.get('/tasks',auth,async(req,res)=>{
    const match ={}
    const sort={}
    if(req.query.sortBy){
      const parts=req.query.sortBy.split(':') 
      sort[parts[0]]=parts[1]=='desc'?-1:1
    }
    if(req.query.completed){
      match.completed=req.query.completed=="true"
    }
    try{
    // const tasks=await Task.find({user:req.user._id})
    // res.status(200).send(tasks)
    //or way
    await req.user.populate({
      path:'usertasks',
      match:match,
      options:{
limit:parseInt(req.query.limit),
skip:parseInt(req.query.skip),
sort:{
  createdAt:-1         //ascending -->1  descending -->-1
}
      }
    }).execPopulate()
    res.send(req.user.usertasks)
    
    }catch(err){
  res.status(400).send(err)
    }
   
  })
  
  router.get('/tasks/:id',auth,async(req,res)=>{
      const _id=req.params.id;
     
      try{
     const task=await Task.findOne({_id,user:req.user._id})
     if(!task)
      return res.status(500).send("Task not found")
     res.status(200).send(task)
      }catch(err){
   res.status(500).send("Task not found")
      }
  })
  
  router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedupdate=['desc','completed']
    let isvalid=updates.every((update)=> allowedupdate.includes(update))
   if(!isvalid){
     return res.status(400).send("Invalid updates")
   }
   try{
     
   const task=await Task.findOne({_id,user:req.user._id})
   
   if(!task)
   {
     return res.status(404).send()
   }
   updates.forEach((update)=>{
       task[update]=req.body[update]
   })
  await task.save()
  res.send(task)
   }catch(err){
     res.status(404).send()
  
   }
  
  })
  router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
  const task=await Task.findByOneAndDelete({_id:req.params.id,user:req.user._id})
  if(!task)
  {return res.status(404).send()
  
  }
  res.send(task)
  }catch(err){
  res.status(404).send(err)
    }
  })


module.exports=router