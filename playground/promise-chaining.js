require('../src/db/mongoose')
const User=require('../src/models/users')
// User.findByIdAndUpdate('61265a8bf7154a70c885e93e',{age :1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })
// 61265a8bf7154a70c885e93e

const updateAgeandCount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age})
    const count=await User.countDocuments({age:1})
    return count

}
updateAgeandCount('61265a8bf7154a70c885e93e',2).then((count)=>{
    console.log(count)
}).catch((err)=>{
    console.log(err)
})