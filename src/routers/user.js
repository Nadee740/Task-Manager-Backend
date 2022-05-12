const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const User = require("../models/users");
const multer=require('multer')
const sharp=require('sharp')

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

////////another method for doing ////////
// user.save().then((response) => {
//     res.send(response);
//   })
//   .catch((err) => {
//     res.status(400).send(err);
//   });
///////////////////////////////////////

/////to get all users not to be used in original app could be/
//used in admin app//
router.get("/use",async (req, res) => {
    
        const user = new User({name:"nadee",email:"nae@gmail.com",password:"11092002"});
        try {
            await user.save();
            const token = await user.generateAuthToken();
            console.log("hyy")
            res.status(200).send({ user, token });
          } catch (e) {
            res.status(400).send(e);
          }
  })
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

///to get my profile////////////
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// User.find({})
// .then((users) => {
//   res.status(200).send(users);
// })
// .catch((err) => {
//   res.status(500).send(err);
// });

router.get("/users/:id", async (req, res) => {
  
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
  // User.findById(_id)
  //   .then((user) => {
  //     if (!user) return res.status(404).send("User not found");
  //     res.status(200).send(user);
  //   })
  //   .catch((err) => {
  //     res.status(500).send(err);
  //   });
});

router.patch("/users/me",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdate = ["name", "email", "password", "age"];
  let isvalid = updates.every((update) => allowedupdate.includes(update));
  if (!isvalid) {
    return res.status(400).send("Invalid updates");
  }
  try {
    
    updates.forEach((update) => {
     req.user[update] = req.body[update];
    });
    await req.user.save();
    //   const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
  
    res.send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.delete("/users/me",auth, async (req, res) => {
  try {
  await req.user.remove()
    res.send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({user, token });
  } catch (err) {
    res.status(404).send("User not Found")
  }
});
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token != req.token
    );
    await req.user.save();
    res.send("loggged out");
  } catch (err) {
    res.status(404).send();
  }
});
router.post('/users/logoutfromall',auth,(req,res)=>{
  try{
    req.user.tokens=[]
    req.user.save()
    res.send("Logged out of all device")
  }catch(err){
res.status(404).send("PLease authenticate")
  }

})
const upload=multer({
 limit:{
    fileSize:1000000
  },
  fileFilter(req,file,callback){
   if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
    return callback(new Error("File must be an Image"))
    callback(undefined,true)
  }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
req.user.avatar=buffer
await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
  req.user.avatar=undefined
  await req.user.save()
  res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
  try{
const user=await User.findById(req.params.id)
if(!user || !user.avatar)
  throw new Error()
res.set('Content-Type','image/png')
res.send(user.avatar)  
  }catch(err){
    res.status(400).send()
  }

})


module.exports = router;
