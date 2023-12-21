import { create } from 'zustand'
import axios from 'axios'

export const useChoicesStore = create((set) => ({

    getChoices: () => {
        axios.get('http://localhost:5000/getChoices')
        .then(res => localStorage.setItem('choices', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    }

}))
