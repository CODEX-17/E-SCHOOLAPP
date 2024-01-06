import { create } from 'zustand'
import axios from 'axios'

export const useFriendStore = create((set) => ({

    getFriend: () => {
        axios.get('http://localhost:5000/getFriend')
        .then(res => localStorage.setItem('friends', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    }

}))
