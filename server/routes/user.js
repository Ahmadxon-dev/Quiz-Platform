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

router.put("/profile/name/edit", async (req,res)=>{
    const {newName, userEmail} = req.body
    await Person.findOneAndUpdate(
        {email:userEmail},
        {name:newName}
    )
    return res.status(200).json({msg: "Ismingiz muvaffaqiyatli o'zgartirildi"})
})

router.put("/role-to-user/", async (req,res)=>{
    const {userEmail} = req.body
    await Person.findOneAndUpdate(
        {email: userEmail},
        {role:"user"}
    )
    const newData = await Person.find().sort({_id:-1})
    return res.status(200).json({msg: "Rol muvaffaqiyatli o'zgartirildi", newData})
})
router.put("/role-to-admin/", async (req,res)=>{
    const {userEmail} = req.body
    await Person.findOneAndUpdate(
        {email: userEmail},
        {role:"admin"}
    )
    const newData = await Person.find().sort({_id:-1})
    return res.status(200).json({msg: "Rol muvaffaqiyatli o'zgartirildi", newData})
})

module.exports = router