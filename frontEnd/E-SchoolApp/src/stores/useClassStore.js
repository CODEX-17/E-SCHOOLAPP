import { create } from 'zustand'
import axios from 'axios'

export const useClassStore = create((set)=> ({

    classes: [],
    addClass: (className , classDesc, acctID) => {
        axios.post('http://localhost:5000/addClass', {className, classDesc, acctID})
        .then(res => console.log(res))
        .catch(err => console.error(err))
    },

    getClass: () => {
        axios.get('http://localhost:5000/getClass')
        .then(res => set({ classes: res.data}))
        .catch(err => console.error(err))
    },

    hideClass: (id, state) => {
        axios.put('http://localhost:5000/hideClass/' + id, { state })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }

}))