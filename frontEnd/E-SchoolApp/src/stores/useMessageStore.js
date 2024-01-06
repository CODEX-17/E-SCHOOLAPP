import { create } from 'zustand'
import axios from 'axios'

export const useMessageStore = create((set) => ({

    getMessages: () => {
        axios.get('http://localhost:5000/getMessages')
        .then(res => localStorage.setItem('messages', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    },

    saveMessages: (data) => {

        const generateUniqueId = () => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            const length = 8
            let result = ''
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length)
                result += charset.charAt(randomIndex)
            }
            return result
        }

        const messageID = generateUniqueId()
        const roomID = data.roomID
        const messageContent = data.messageContent
        const messageSender = data.messageSender
        const messageReceiver = data.messageReceiver
        const date = data.date
        const time = data.time

        axios.post('http://localhost:5000/saveMessages', {messageID, roomID, messageContent, messageSender, messageReceiver, date, time})
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
    }

}))
