import { create } from 'zustand'
import axios from 'axios'

export const useFillLayoutStore = create((set) => ({

    getFillLayout: () => {
        axios.get('http://localhost:5000/getFillLayout')
        .then(res => localStorage.setItem('fillLayout', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    }

}))
