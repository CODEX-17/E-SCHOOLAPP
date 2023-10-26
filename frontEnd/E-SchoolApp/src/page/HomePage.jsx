import React, { useEffect, useState } from 'react'
import NavbarComponent from '../components/NavbarComponent'
import style from './HomePage.module.css'
import SidebarComponent from '../components/SidebarComponent'
import CreateUser from './CreateUser'
import { useAccountStore } from '../stores/useAccountsStore'
import QuizGenerator from './QuizGenerator'
import { useNavigateStore } from '../stores/useNavigateStore'
import { Quiz } from './Quiz'
import ClassPage from './ClassPage'


const HomePage = () => {

  const { accountFiltered } = useAccountStore()
  const { routeChoose } = useNavigateStore()
  const status = accountFiltered.status
  console.log(status)

  
  return (
    
      <div className={style.container}>
        <div className={style.nav}>
          <NavbarComponent/>
     
        </div>
        <div className={style.horizontal}>
          <div className={style.left}>
              <SidebarComponent/>
          </div>
          <div className={style.right}>
            {routeChoose === 'quiz' && <QuizGenerator/>}
            {routeChoose === 'createUser' && <CreateUser/>}
            {routeChoose === 'quizDev' && <Quiz/>}
            {routeChoose === 'class' && <ClassPage/>}

            {/* { 
              isToastOpen && (
                <div className={style.toast}>
                  <img src={logo} width={30} alt="logo" />
                  <h1 className={style.toastTitle}>{toastMessage}</h1>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto"></button>
                </div>
              )
            } */}
            
          </div>
        </div>

        
       

      </div>
    
  )
}

export default HomePage