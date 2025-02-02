const {Schema, model} = require("mongoose");


const TopicAndQuestionSchema = new Schema({
    maintopicname: { type: String, required: true },
    subtopics: [
        {
            subtopicname: { type: String, required: true },
            questions: [
                {
                    questionId: {type: Schema.ObjectId}, // Schema.types.ObjectId qilganda ishlamagani uchun boshqaacha usul bilan yozildi
                    question: { type: String, required: true },
                    answer: { type: String, required: true },
                    options: [{ type: String, required: true }]
                }
            ]
        }
    ]
}, {timestamps:true, collection: "Topics and Questions"})

module.exports = model( "TopicAndQuestion", TopicAndQuestionSchema)