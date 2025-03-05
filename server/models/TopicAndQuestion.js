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
                    questionImage: {
                        type: String, // Cloudinary URL for the image
                        required: false
                    },
                    answer: { type: String, required: true },
                    answerImage: { type: String, required: false},
                    options: [{
                        text: {
                            type: String,
                            required: true
                        },
                        image: {
                            type: String, // Cloudinary URL for the option image
                            required: false
                        }
                    }]
                    // options: [{ type: String, required: true }]
                }
            ]
        }
    ]
}, {timestamps:true, collection: "Topics and Questions"})

module.exports = model( "TopicAndQuestion", TopicAndQuestionSchema)