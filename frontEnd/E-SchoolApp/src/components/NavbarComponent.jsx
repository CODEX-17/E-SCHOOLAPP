import React, { useEffect, useState } from 'react'
import style from './NavBarComponent.module.css';
import logo from '../assets/logo-white.png'
import titleLogo from '../assets/title.png'
import { useNavigate, Link } from 'react-router-dom';
import { useNavigateStore } from '../stores/useNavigateStore';
import { IoNotifications } from "react-icons/io5";
import axios from 'axios';

const NavbarComponent = () => {
  const navigate = useNavigate()

  const { updateRouteChoose } = useNavigateStore()
  const [imageData, setimageData] = useState(null)
  const [isShowProfile, setisShowProfile] = useState(false)
  const [acctImage, setacctImage] = useState(null)
  const [isShowManageAcct, setIsShowManageAcct] = useState(false)

  
  useEffect(() => {
    
    if (!localStorage.getItem('authtoken') || !localStorage.getItem('user') ) {
        navigate('/')
    }else {
      getImage()
    }

  },[])

  const accountCurrent = JSON.parse(localStorage.getItem('user'))
  let fullname = accountCurrent?.firstname + ' ' + accountCurrent?.middlename + '. ' + accountCurrent?.lastname

  
  const getImage = () => {
    const id = accountCurrent?.imageID
    axios.get('http://localhost:5000/getImage/'+id)
    .then(res => {
      const image = res.data 
      setimageData(image)
      setacctImage('http://localhost:5000/'+image[0].data)
    })
    .catch(err => console.error(err))
  }

  const handleLogout = () => { 
    updateRouteChoose('chat')
    localStorage.clear()
    navigate('/')
  }

  const handleRoutes = (choice) => {
      updateRouteChoose(choice)
  }

  const handleProfile = () => {
    if (isShowProfile) {
      setisShowProfile(false)
    }else {
      setisShowProfile(true)
    }
    
  }

  const handleManageAccount = (route) => {
    updateRouteChoose(route)
    setIsShowManageAcct(!isShowManageAcct)
  }


  return (
    <div className={style.navbar}>
        <div className={style.left}>
          <img src={logo} alt="logo" width={40}/>
          <img src={titleLogo} className={style.titleLogo} alt="titleLogo" width={150} />
        </div>
        <div className={style.right}>
          <div className={style.menuTop}>
            <IoNotifications id={style.notif}/>
            <img src={acctImage}  alt="profile" id={style.profile} onClick={handleProfile}/>
          </div>
          {
            isShowProfile && (
              <div id={style.dropDown}>
                <div className={style.horizontal}>
                    <span className={style.profileIcon}>
                      <img src={acctImage} id={style.profilePic} alt=""/>
                    </span>
                    <div className={style.vertical}>
                      <p>Name:</p>
                      <h1>{fullname}</h1>
                      <p>Email:</p>
                      <h2>{accountCurrent?.email}</h2>
                    </div>
                </div>
                <div className='d-flex w-100 gap-2 align-items-center justify-content-center mt-2'>
                    <button className={style.btnManageAcct} onClick={() => handleManageAccount('manageAccount')}>Manage account</button>
                    <button className={style.btnLogout} onClick={handleLogout}>Sign out</button>
                </div>
                  
              </div>
            )
          }
          
        </div>
        
    </div>
  )
}

export default NavbarComponent





  	