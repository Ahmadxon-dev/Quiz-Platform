const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000
const cloudinary = require('cloudinary').v2;
const Topic = require("./models/TopicAndQuestion")

require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,        // Your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET   // Your Cloudinary API secret
});
app.use(cors({
    origin:"*",
    credentials:true,
    optionsSuccessStatus: 200,
}))
app.use(express.json())
app.use('/auth', require("./routes/authorization"))
app.use('/test', require("./routes/test"))
app.use('/user', require("./routes/user"))
mongoose.connect(process.env.MONGO_URI+"test")
.then(()=> {
    console.log("db connected successfully")
    // moveSubtopic()
})
.catch(error=>console.log(error))

app.get('/', (req,res)=>{
    res.send('Server working')

})

app.listen(PORT, (req,res)=>{
    console.log("server has been started on port 5000")
})

// async function moveSubtopic() {
//     // Define the names
//     const sourceTopicName = "Kinematika";
//     const targetTopicName = "Dinamika asoslari";
//     const subtopicName = "Vazn";
//
//     // Find the source topic document
//     const sourceTopic = await Topic.findOne({ maintopicname: sourceTopicName });
//
//     if (!sourceTopic) {
//         console.log("Source topic not found.");
//         return;
//     }
//
//     // Find the subtopic to move
//     const subtopicIndex = sourceTopic.subtopics.findIndex(sub => sub.subtopicname === subtopicName);
//
//     if (subtopicIndex === -1) {
//         console.log("Subtopic not found in source.");
//         return;
//     }
//
//     // Extract the subtopic
//     const [subtopicToMove] = sourceTopic.subtopics.splice(subtopicIndex, 1);
//
//     // Save the updated source topic (remove subtopic)
//     await sourceTopic.save();
//
//     // Find the target topic document
//     const targetTopic = await Topic.findOne({ maintopicname: targetTopicName });
//
//     if (!targetTopic) {
//         console.log("Target topic not found.");
//         return;
//     }
//
//     // Add the subtopic to the target topic
//     targetTopic.subtopics.push(subtopicToMove);
//
//     // Save the updated target topic
//     await targetTopic.save();
//
//     console.log("Subtopic moved successfully!");
// }
