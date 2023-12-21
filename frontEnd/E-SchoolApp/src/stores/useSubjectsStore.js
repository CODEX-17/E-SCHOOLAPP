import { create } from 'zustand'
import axios from 'axios'

export const useSubjectsStore = create((set) => ({
    subjects: [],
    getSubjects: () => {
        axios.get('http://localhost:5000/getSubjects')
        .then(res => set({ subjects: res.data }))
        .then(err => console.error(err))
    },
}))