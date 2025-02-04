const {Schema, model} = require("mongoose");

const TestSchema = new Schema({
    subtopicname:[{type:String, required:true}],
    questions: [{ questionId: {type: Schema.ObjectId}, question:String, selectedAnswer: String, options:[String], answer:String }],
    startTime: Date,
    remainingTime: Number, //  time in seconds
    isCompleted: Boolean,
    result:{type:Number, default:0},
    userEmail:{type:String}
},  {timestamps:true, collection: "Tests"})

module.exports = model("Test", TestSchema)