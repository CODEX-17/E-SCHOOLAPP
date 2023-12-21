import { create } from 'zustand'
import axios from 'axios'

export const useImageStore = create((set) => ({
    images: [],
    getImagesById: (id) => {
        axios.get('http://localhost:5000/getImage/'+id)
        .then(res => set({ images: res.data}))
        .catch(err => console.error(err))
    },

    getImages: () => {
        axios.get('http://localhost:5000/getALLImages')
        .then((res) => localStorage.setItem('images', JSON.stringify(res.data)))
        .catch((error) => console.error(error))
    },

    updateImageById: (formData) => {
        axios.put('http://localhost:5000/updateImageAcct', formData, {
          headers: {
          'Content-Type': 'multipart/form-data',
            },
        } )
        .then (res => console.log(res.data))
        .catch(err => console.log(err))
    },

    uploadImage: (imageFile) => {
        const {imageID, file} = imageFile
        const formData = new FormData()
        formData.append('image', file)
        formData.append('imageID', imageID)

        axios.post('http://localhost:5000/upload', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
        })
        .then(res => console.log(res.data))
        .catch(error => console.log(error)) 

    },

}))