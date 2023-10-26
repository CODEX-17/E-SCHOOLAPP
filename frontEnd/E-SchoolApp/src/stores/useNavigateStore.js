import { create } from 'zustand'

export const useNavigateStore = create((set) => ({

    routeChoose: 'createUser',
    updateRouteChoose: (choose) => {
        set({ routeChoose: choose})
    }

}))
