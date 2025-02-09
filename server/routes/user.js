const {Router} = require('express')
const router = Router()
const Person  = require("../models/Person")
const bcrypt  = require('bcrypt')
router.get("/get-users", async (req,res)=>{
    const data = await Person.find().sort({_id:-1})
    return res.status(200).json(data)
})

router.put("/edit/:userId", async (req,res)=>{
    const {email, name} = req.body
    const {userId} = req.params

    await Person.findByIdAndUpdate(userId, {
        email,
        name
    },
        {new: true}
    )
    const allUsers = await Person.find().sort({_id:-1})
    return res.status(200).json({msg:"Malumotlar Yangilandi", allUsers})
})

router.delete("/delete/:userId", async (req,res) =>{
    const {userId} = req.params
    await Person.findByIdAndDelete(userId)
    const allUsers = await Person.find().sort({_id:-1})
    return res.status(200).json({msg:"Muvaffaqiyatli o'chirildi", allUsers})
})


module.exports = router