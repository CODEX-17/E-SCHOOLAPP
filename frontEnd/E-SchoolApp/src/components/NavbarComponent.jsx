import React, { useState } from 'react'
import style from './NavBarComponent.module.css';
import logo from '../assets/logo-white.png'
import titleLogo from '../assets/title.png'
import { useNavigate, Link } from 'react-router-dom';
import { useAccountStore } from '../stores/useAccountsStore';
import { useNavigateStore } from '../stores/useNavigateStore';
import { BiSolidUserCircle } from "react-icons/bi";

const NavbarComponent = () => {

  const { updateStatus, accountFiltered, updateAccountFiltered} = useAccountStore()
  const { updateRouteChoose } = useNavigateStore()
  const navigate = useNavigate()
  const [isShowProfile, setisShowProfile] = useState(false)


  const handleLogout = () => { 
    
    const status = 'logout'
    const id = accountFiltered.id
    console.log('userID:' + id)
    updateStatus( id, status )
    updateAccountFiltered(false)
    navigate('/login')
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

  return (
    <div className={style.navbar}>
        <div className={style.left}>
          <img src={logo} alt="logo" width={40}/>
          <img src={titleLogo}  className={style.titleLogo} alt="titleLogo" width={150} />
        </div>
        <div className={style.right}>
          <BiSolidUserCircle id={style.profile} onClick={handleProfile}/>
          {
            isShowProfile && (
              <div id={style.dropDown}>
                <div className={style.horizontal}>
                    <span className={style.profileIcon}></span>
                    <div className={style.vertical}>
                      <p>Name:</p>
                      <h1>Rumar Pamparo</h1>
                      <p>Email:</p>
                      <h2>pamparor@gmail.com</h2>
                    </div>
                </div>
                  <button className={style.btnLogout} onClick={handleLogout}>logout</button>
              </div>
            )
          }
          
        </div>
        
    </div>
  )
}

export default NavbarComponent