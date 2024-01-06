import React, { useEffect, useState } from 'react'
import NavbarComponent from '../components/NavbarComponent'
import style from './HomePage.module.css'
import SidebarComponent from '../components/SidebarComponent'
import CreateUser from './CreateUser'
import { useAccountStore } from '../stores/useAccountsStore'
import QuizGenerator from './QuizGenerator'
import { useNavigateStore } from '../stores/useNavigateStore'
import { useNavigate } from 'react-router-dom';
import { Quiz } from './Quiz'
import ClassPage from './ClassPage'
import PreviewQuiz from './PreviewQuiz'
import ChatPage from './ChatPage'
import ActivityPage from './ActivityPage'
import ManageAccout from './ManageAccout'
import axios from 'axios'
import { useImageStore } from '../stores/useImageStore'
import { usePostStore } from '../stores/usePostStore'
import { useMemberStore } from '../stores/useMemberStore'
import FilePage from './FilePage'
import { useQuestionsStore } from '../stores/useQuestionsStore'
import { useFillLayoutStore } from '../stores/useFillLayoutStore'
import { useChoicesStore } from '../stores/useChoicesStore'
import { useQuizStore } from '../stores/useQuizStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useFriendStore } from '../stores/useFriendStore'
import QuizTake from './QuizTake'
import { useFilesStore } from '../stores/useFilesStore'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const HomePage = () => {
  const { routeChoose } = useNavigateStore()
  const { getImages } = useImageStore()
  const { getPost } = usePostStore()
  const { getMembers } = useMemberStore()
  const { getQuestion } = useQuestionsStore()
  const { getFillLayout } = useFillLayoutStore()
  const { getChoices } = useChoicesStore()
  const { getQuiz } = useQuizStore()
  const { getMessages } = useMessageStore()
  const { getFriend } = useFriendStore()
  const { getFiles } = useFilesStore()

  const navigate = useNavigate()
  
  useEffect(() => {
    getFriend()
    getQuiz()
    getChoices()
    getQuestion()
    getFillLayout()
    getMembers()
    getClassesAll()
    getPost()
    getImages()
    getAccounts()
    getMessages()
    getFiles()
    const authtoken = localStorage.getItem('authtoken')
    const userAccount = localStorage.getItem('user') 
    
    if (!authtoken || !userAccount) {
        navigate('/')
    }

  },[])

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log(currentUser)
    socket.emit('online', currentUser.acctID);
  },[])

  const getClassesAll = () => {
    axios.get('http://localhost:5000/getClass')
    .then((res) => localStorage.setItem('classes', JSON.stringify(res.data)))
    .catch((error) => console.error(error))
  }

  const getAccounts = () => {
    axios.get('http://localhost:5000/getAccount')
    .then(res => localStorage.setItem('accounts', JSON.stringify(res.data)))
    .catch(err => console.error(err))
  }


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
            {routeChoose === 'activity' && <ActivityPage/>}
            {routeChoose === 'chat' && <ChatPage/>}
            {routeChoose === 'createUser' && <CreateUser/>}
            {routeChoose === 'quizDev' && <Quiz/>}
            {routeChoose === 'class' && <ClassPage/>}
            {routeChoose === 'quizTake' && <QuizTake/>}
            {routeChoose === 'manageAccount' && <ManageAccout/>}
            {routeChoose === 'file' && <FilePage/>}

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