import { create } from 'zustand'
import axios from 'axios'

export const useMemberStore = create((set)=> ({

    members: [],
    getMembers: () => {
        axios.get('http://localhost:5000/getMembers')
        .then((res) => localStorage.setItem('members', JSON.stringify(res.data)))
        .catch((error) => console.error(error))
    },

}))