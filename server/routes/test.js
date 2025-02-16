const {Router} = require('express')
const router = Router()
const Test = require("../models/Test")
const TopicAndQuestion = require("../models/TopicAndQuestion")
const {all} = require("express/lib/application");
//start

router.get("/getfulltestdb", async (req,res)=>{
    const data = await TopicAndQuestion.find()
    return res.json(data)
})
router.post("/start", async (req,res)=>{
    const {time, subtopicnamesArray, userEmail, numberOfQuestions } = req.body
    const topic = await TopicAndQuestion.findOne({
        "subtopics.subtopicname": { $in: subtopicnamesArray },
    });
    if (!topic){
        return res.status(400).json({error: "Subtopic not found"})
    }
    let allQuestions = []
    topic.subtopics?.forEach(subtopic=>{
        subtopic.questions.forEach(question=>allQuestions.push(question))
    })
    if (allQuestions.length<numberOfQuestions){
        return res.status(400).json({ error: `Tanlangan savollar soni, savollardan ko'p.`, additional:`Barcha savollar: ${allQuestions.length}ta` });

    }
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()); // Shuffle array
    const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions || allQuestions.length); // Limit questions
    const newTest = new Test({
        subtopicname: subtopicnamesArray,
        questions:selectedQuestions,
        startTime: new Date(),
        remainingTime: time, // Example: 1 hour
        isCompleted: false,
        userEmail,
    })
    await newTest.save()
    return res.status(200).json({msg:"test created", testId:newTest._id, newTest})
})

router.get("/:testId", async (req,res)=>{
    const {testId} = req.params
    await Test.findById(testId)
        .then(test=>{
            return res.status(200).json(test)
        })
})

router.put("/submit/:testId", async (req,res)=>{
    const {testId} = req.params
    const {remainingTime, isCompleted} = req.body
    // const updated = await Test.findByIdAndUpdate(
    //     testId,
    //     {$set: {remainingTime, isCompleted}},
    //     { new: true }
    // )
    const test = await Test.findById(testId)
    test.remainingTime = remainingTime
    test.isCompleted=isCompleted
    let score = 0
    const questionsNumber = test.questions.length
    for (let i = 0; i < questionsNumber; i++) {
        if (test.questions[i].answer === test.questions[i].selectedAnswer){
            score+=1
        }
    }
    test.result=score
    await test.save()
    if (!test) return res.status(400).json({error: "Test not updated"})
    res.status(200).json({msg: "Test updated"})

})

router.put("/:testId/answer", async (req,res)=>{
    const {testId} = req.params
    const { questionIndex, selectedAnswer} = req.body
    try{
        const test = await Test.findById(testId)
        if (questionIndex < 0 || questionIndex >= test.questions.length) {
            return res.status(400).json({ message: "Invalid question index" });
        }
        test.questions[questionIndex].selectedAnswer = selectedAnswer;
        await test.save()
    }catch (e){
        console.log(e)
    }
})

router.get("/results/:userEmail", async (req,res)=>{
    const {userEmail} = req.params
    const test = await Test.find({userEmail}).sort({ _id: -1 })
    return res.json(test)
})

module.exports = router