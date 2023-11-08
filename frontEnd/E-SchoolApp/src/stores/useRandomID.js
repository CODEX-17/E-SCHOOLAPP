import { create } from 'zustand'

export const useRandomID = create((set) => ({

    randomID: '',

    randomFunction: () => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            set({randomID: charset.charAt(randomIndex) })
        }
    },

}))