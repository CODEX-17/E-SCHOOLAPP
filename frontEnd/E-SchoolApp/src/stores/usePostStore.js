import { create } from 'zustand'
import axios from 'axios'

export const usePostStore = create((set) => ({

    uploadPost: (postSet) => {
        const acctID = postSet.acctID
        const datePosted = postSet.datePosted
        const fileID = postSet.fileID
        const heartCount = postSet.heartCount
        const imageID = postSet.imageID
        const likeCount = postSet.likeCount
        const name = postSet.name
        const postContent = postSet.postContent
        const replyID = postSet.replyID
        const subjectName = postSet.subjectName
        const timePosted = postSet.timePosted
        const classCode = postSet.classCode
        const postType = postSet.postType
        const quizID = postSet.quizID
        const duration = postSet.duration

        axios.post('http://localhost:5000/uploadPost', { 
            acctID,
            name,
            timePosted,
            datePosted,
            postContent,
            replyID,
            imageID,
            fileID,
            heartCount,
            likeCount,
            classCode,
            subjectName,
            postType,
            quizID,
            duration,
        } )
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
    },

    deletePost: (id) => {
        axios.delete('http://localhost:5000/deletePost/'+id)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
    },

    getPost: () => {
        axios.get('http://localhost:5000/getPost')
        .then(res => localStorage.setItem('post', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    },

}))
