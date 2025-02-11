const {Router} = require('express')
const router = Router()
const Person  = require("../models/Person")
const bcrypt  = require('bcrypt')
router.get("/get-users", async (req,res)=>{
    const data = await Person.find().sort({_id:-1})
    return res.status(200).json(data)
})

router.put("/edit/:userId", async (req,res)=>{
    const {password} = req.body
    const {userId} = req.params

    const newPassword = await bcrypt.hash(password, 10)
    await Person.findByIdAndUpdate(userId, {
        password:newPassword
    },
        {new: true}
    )
    const allUsers = await Person.find().sort({_id:-1})
    return res.status(200).json({msg:"Parol Yangilandi", allUsers})
})

router.delete("/delete/:userId", async (req,res) =>{
    const {userId} = req.params
    await Person.findByIdAndDelete(userId)
    const allUsers = await Person.find().sort({_id:-1})
    return res.status(200).json({msg:"Muvaffaqiyatli o'chirildi", allUsers})
})


module.exports = router