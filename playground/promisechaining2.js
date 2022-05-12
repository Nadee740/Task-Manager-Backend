require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete("612606f144b3a31f50d22eed").then((res)=>{
//     console.log(res)
//     return Task.countDocuments(({completed:false}))
// }).then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// })

const deletetaskandcount=async(id)=>{
    await Task.findByIdAndDelete(id);
    const count=await Task.countDocuments(({completed:false}))
    return count
}
deletetaskandcount("612712983971127ac4a4acc0").then((count)=>{
    console.log(count)
}).catch((err)=>{
    console.log(err)
})


// 6125e6758350ac3708209282