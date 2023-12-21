import { create } from 'zustand';
import axios from 'axios';

export const useAccountStore = create((set) => ({

    isAuthenticated: false,
    account: null,
    accountFiltered: '',
    currentAccount: null,

    getAccounts: () => {
        axios.get('http://localhost:5000/getAccount')
        .then(result => {
            localStorage.setItem('accounts', JSON.stringify(result.data))
            set({account: result.data})
        })
        .catch(err => console.error(err))
    },

    getAccountById: (id) => {
        axios.get('http://localhost:5000/getAcctById/'+id)
        .then(result => {
            set({currentAccount: result.data})
        })
        .catch(err => console.error(err))
    },

    updateisAuthenticated: (data) => {
        set({isAuthenticated: data})
    },

    addAccounts: (data) => {
        set((accountData) => ({...accountData, accountData: data}))
    },

    updateAccountFiltered: (data) => {
        set({accountFiltered: data})
        localStorage.setItem('user', JSON.stringify(data))
    },

    updateStatus: (id, status) => {
        axios.put('http://localhost:5000/status/' + id, { status })
        .then(res => {
            console.log(res)
            const data = JSON.parse(localStorage.getItem('user'))
            data.status = status
            localStorage.setItem('user', JSON.stringify(data));

        })
        .catch(err => console.log(err))
    },

    updatePassword: (id, newPass) => {
        axios.put('http://localhost:5000/updatePassword/' + id, { newPass })
        .then( res => console.log(res))
        .catch(err => console.log(err))
    },



}));

