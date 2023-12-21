import React,{ useEffect, useState } from 'react'
import style from './ManageAccout.module.css'
import { Howl, Howler } from "howler";
import { BiSolidShow } from 'react-icons/bi'
import axios from 'axios'
import logo from '../assets/logo.png'
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3';
import { ToastContainer, toast } from 'react-toastify';
import { useImageStore } from '../stores/useImageStore';
import { useAccountStore } from '../stores/useAccountsStore';
import sample from '../assets/sample.jpg'


const ManageAccout = () => {

  const [image, setImage] = useState(null)
  const [oldImage, setoldImage] = useState(null)
  const [updatedDataUser, setUpdatedDataUser] = useState(null)
  const [showPassword, setShowPass] = useState(false)
  const [accountCurrent, setaccountCurrent] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const accountList = JSON.parse(localStorage.getItem('accounts')) || null
  const [currentAcct, setcurrentAcct] = useState(accountList.filter((acct) => acct.id === accountCurrent.id ))
  let fullname = accountCurrent.firstname + ' ' + accountCurrent.middlename.charAt(0) + '. ' + accountCurrent.lastname
  const { getImagesById, images, updateImageById } = useImageStore()
  const { updatePassword, getAccountById, currentAccount } = useAccountStore()
  const [updatedPassword, setupdatedPassword] = useState(accountCurrent.password)
  const notif = new Howl({ src: [notifSound]})
  const errSound = new Howl({ src: [erroSound]})

  useEffect(()=> {
    getImagesById(accountCurrent.imageID)
    if (images.length > 0) {
      setoldImage('http://localhost:5000/'+images[0].data)
    }
   
  },[])

  const notify = (message, state) => {
    console.log(message);
     if (state === 'err') {
        errSound.play()
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
     }
    else if (state ==='success') {
        notif.play()
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    
} 

  const isImageType = (file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
    const extension = file.name.split('.').pop().toLowerCase()
    return allowedExtensions.includes(extension)
  }

  const handleInputChange = (e) => {
    e.preventDefault()
  }


  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && isImageType(file)) {
      handleFile(file)
    }else {
      const message = 'Only images are allowed'
      notify(message, 'err')
    }
  };

  const handleFile = (file) => {
    if (file) {
      setImage({
        file,
        imageID: accountCurrent.imageID,
      })
    
    }
  }

  const updateImageToDatabase = (data) => {

    if (data) {
      const formData = new FormData()
      formData.append('image', data.file)
      formData.append('imageID', data.imageID)

      updateImageById(formData)
    }else {
      console.log('no data')
    }
   

    
  }
  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
  };

  const handleDragLeave = (e) => {
    e.preventDefault()
  };

  const handleUpload = () => {
    if (image) {
      updateImageToDatabase(image)
    }

    if (updatedPassword) {
      const acctID = accountCurrent.acctID
      updatePassword(acctID, updatedPassword)
      let updatedAcct = accountCurrent
      updatedAcct.password = updatedPassword
      localStorage.setItem('user', JSON.stringify(updatedAcct))
    }

    const message = 'Successfully update your profile'
    notify(message, 'success')
   
  }


  return (
    <div className={style.container}>
        <div className={style.content}>
          <ToastContainer/>
            <h1>Personal Information</h1>
            <div className={style.editProfile}>
                <div
                    className={style.circleUpload}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    { image ? (
                      <img src={URL.createObjectURL(image.file)} alt="Uploaded" className={style.imgUploaded} />
                    ) : ( 
                      <p>Drag & drop an image here <br/> or click to select one</p>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                />
                <div className='d-flex flex-column w-50 gap-2'>
                    <div className='d-flex flex-column'>
                        <p className='m-0' id={style.label} title='cannot be editted as admin'>Name:</p>
                        <input className={style.inputBarDis} type="text" value={fullname} disabled/>
                    </div>
                    <div className='d-flex flex-column'>
                        <p className='m-0' id={style.label} title='cannot be editted as admin'>Email:</p>
                        <input className={style.inputBarDis} type="text" value={accountCurrent.email}/>
                    </div>
                    <div className='d-flex flex-column'>
                        <p className='m-0' id={style.label}>Password:</p>
                        <div className='d-flex align-items-center gap-2 position-relative'>
                            <input id={style.inputBar} type={showPassword ? 'text': 'password'} value={updatedPassword} onChange={(e) => setupdatedPassword(e.target.value)}/>
                            <BiSolidShow size={20} id={style.showPass} onClick={() => setShowPass(!showPassword)}/>
                        </div>
                    </div>
                </div>

            </div>
                <button onClick={handleUpload} id={style.btnSave}>Update</button>
        </div>
    </div>
  )
}

export default ManageAccout

