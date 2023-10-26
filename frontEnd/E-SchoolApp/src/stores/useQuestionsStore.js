import { create } from 'zustand'
import axios from 'axios'

export const useQuestionsStore = create((set) => ({

    questions: [],
    getQuestion: () => {
        axios.get('http://localhost:5000/getQuestion')
        .then(res => {
            set({questions: res.data})
        })
        .catch(err => console.log(err))
    },

    addQuestions: (dataObj) => {


        for (let i = 0; i < dataObj.length; i++) {
            const data = dataObj[i]

            const questionTitle = data.questionTitle
            const questionDescription = data.questionDescription
            const questionNumber = data.questionNumber
            const questionContent = data.questionContent
            const questionType = data.questionType
            const points = data.points
            const required = data.required
            const choices = data.choices

            axios.put('http://localhost:5000/questions', { questionTitle, questionDescription, questionNumber, questionContent, questionType, points, required})
            .then(res => console.log(res))
            .catch(err => console.log(err))

            for (let int = 0; int < choices.length; int++) {
                const questionID = choices[int].questionID;
                const letter = choices[int].letter;
                const content = choices[int].content;
                const correct = choices[int].correct;

                axios.put('http://localhost:5000/choices', { questionID, letter, content, correct })
                .then(res => console.log(res))
                .catch(err => console.log(err))
                
            }

        
        }

        
    },

    addChoicesDataBase: (dataObj) => {

        for (let int = 0; int < dataObj.length; int++) {
            const choices = dataObj[int]
            for (let i = 0; i < choices.length; i++) {
                const questionID = data[i].questionID
                const letter = data[i].letter
                const content = data[i].content
                const correct = data[i].correct
                
                
            }
        
        }
    }


}))