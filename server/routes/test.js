const {Router} = require('express')
const router = Router()
const Test = require("../models/Test")
const TopicAndQuestion = require("../models/TopicAndQuestion")
const {all} = require("express/lib/application");
const mongoose = require("mongoose");
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

router.put("/topics/add", async (req,res)=>{
    const { newMainTopic } = req.body
    const newTopic = new TopicAndQuestion({
        maintopicname: newMainTopic,
        subtopics:[]
    })
    await newTopic.save()
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Yangi bo'lim muvaffaqiyatli yaratildi", newData})
})
router.delete("/topics/delete", async (req,res)=>{
    const { mainTopicId } = req.body
    await TopicAndQuestion.findByIdAndDelete(mainTopicId)
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Bo'lim muvaffaqiyatli o'chirildi", newData})
})
router.put("/topics/edit", async (req,res)=>{
    const { mainTopicId, newMainTopicName } = req.body
    await TopicAndQuestion.findByIdAndUpdate(mainTopicId, {maintopicname:newMainTopicName })
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Bo'lim muvaffaqiyatli o'zgartirildi", newData})
})


router.post("/subtopics/add", async (req,res)=>{
    const { newSubTopic, mainTopicId } = req.body
    await TopicAndQuestion.findByIdAndUpdate(mainTopicId,
        {
            $push: {
                subtopics: {
                    subtopicname: newSubTopic,
                    questions: []
                }
            }
        },
        { new: true }
        )
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Yangi mavzu muvaffaqiyatli yaratildi", newData})
})
router.delete("/subtopics/delete", async (req,res)=>{
    const { subTopicName, mainTopicId } = req.body
    await TopicAndQuestion.findByIdAndUpdate(
        mainTopicId,
        {
            $pull: {
                subtopics: { subtopicname: subTopicName }
            }
        },
        { new: true }
    )
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Mavzu muvaffaqiyatli o'chirildi", newData})
})

router.put("/subtopics/edit", async (req,res)=>{
    const { mainTopicId, newSubTopicName, oldSubTopicName } = req.body
    await TopicAndQuestion.findOneAndUpdate(
        { _id: mainTopicId, "subtopics.subtopicname": oldSubTopicName },
        { $set: { "subtopics.$.subtopicname": newSubTopicName } },
        { new: true }
    )
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Mavzu muvaffaqiyatli o'zgartirildi", newData})
})

router.post("/questions/add", async (req,res)=>{
    const {mainTopicId, subTopicName, question, answer, options} = req.body
    await TopicAndQuestion.findOneAndUpdate(
        { _id: mainTopicId, "subtopics.subtopicname": subTopicName },
        {
            $push: {
                "subtopics.$.questions": {
                    questionId: new mongoose.Types.ObjectId(),
                    question,
                    answer,
                    options
                }
            }
        },
        { new: true }
    )
    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Yangi savol muvaffaqiyatli qo'shildi", newData})
})
router.delete("/questions/delete", async (req,res)=>{
    const { mainTopicId, subTopicName, questionId } = req.body;

    await TopicAndQuestion.findOneAndUpdate(
        { _id: mainTopicId, "subtopics.subtopicname": subTopicName },
        {
            $pull: {
                "subtopics.$[subtopic].questions": { questionId: new mongoose.Types.ObjectId(questionId) }
            }
        },
        {
            new: true,
            arrayFilters: [{ "subtopic.subtopicname": subTopicName }] // Ensures it targets only the correct subtopic
        }
    );

    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Savol muvaffaqiyatli o'chirildi", newData})
})
router.put("/questions/edit", async (req,res)=>{
    const {mainTopicId, subTopicName, questionId, newQuestion, options, answer} = req.body

    await TopicAndQuestion.findOneAndUpdate(
        { _id: mainTopicId, "subtopics.subtopicname": subTopicName, "subtopics.questions.questionId": questionId },
        {
            $set: {
                "subtopics.$[subtopic].questions.$[question].question": newQuestion,
                "subtopics.$[subtopic].questions.$[question].options": options,
                "subtopics.$[subtopic].questions.$[question].answer": answer
            }
        },
        {
            new: true,
            arrayFilters: [
                { "subtopic.subtopicname": subTopicName },
                { "question.questionId": new mongoose.Types.ObjectId(questionId) }
            ]
        }
    );

    const newData = await TopicAndQuestion.find()
    return res.status(200).json({msg: "Savol muvaffaqiyatli o'zgartirildi", newData})
})
module.exports = router