import { create } from 'zustand'

export const useToastStore = create((set) => ({

    isToastOpen: true,
    toastMessage: '',

    updatedToastMessage: (message) => {
        set({toastMessage: message})
    },

    openToast: () => {
        set({isToastOpen: (false)})
    },

}))