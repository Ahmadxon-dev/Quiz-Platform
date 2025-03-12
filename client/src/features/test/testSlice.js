import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    testData: {
        subtopicname: [],
        questions: [{
            questionText:null,
            questionImage:null,
            correctAnswer:null,
            options: {
                option1:null,
                option2:null,
                option3:null,
                option4:null,
                option5:null
            },
            selectedAnswer:null
        }],
        remainingTime:null,
        isCompleted: false
    }
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers:{
        setTest: (state, action) => {
            state.testData = action.payload;
        },
        updateAnswer: (state, action) =>{
            const {index, answer} = action.payload
            if (state.testData){
                state.testData.questions[index].selectedAnswer = answer
            }
        },
        removeAnswer: (state, action) =>{
            const {index} = action.payload
            if (state.testData){
                state.testData.questions[index].selectedAnswer = null
            }
        },
        setTime: (state, action)=>{
            if (state.testData){
                state.testData.remainingTime = action.payload
            }
        }
    }
})
export const {setTest, updateAnswer,removeAnswer, setTime} = testSlice.actions
export default testSlice.reducer