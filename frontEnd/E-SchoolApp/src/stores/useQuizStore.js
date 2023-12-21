import { create } from 'zustand'
import axios from 'axios'

export const useQuizStore = create((set) => ({

    getQuiz: () => {
        axios.get('http://localhost:5000/getQuiz')
        .then(result => localStorage.setItem('quiz', JSON.stringify(result.data)))
        .catch(err => console.error(err))
    }

}))
