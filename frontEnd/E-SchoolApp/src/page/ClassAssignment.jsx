import React, { useEffect, useState } from 'react'
import style from './ClassAssignment.module.css'
import { BsCalendar3 } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { GoStar } from "react-icons/go";
import { IoIosSend } from "react-icons/io";
import { SlNotebook } from "react-icons/sl";
import { RiContrastDropLine } from 'react-icons/ri';
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3'; 
import { Howl, Howler } from "howler";
import { ToastContainer, toast } from 'react-toastify';

const ClassAssignment = ({ postType, quizObj, handlePostAssignment }) => {

  const currentPostType = postType? postType : 'schedule'
  const currentQuizObj = quizObj
  const [isShowQuizThumbnail, setShowQuizThumbnail] = useState(false)
  const [postContent, setpostContent] = useState('')

  const notif = new Howl({ src: [notifSound]})
  const errSound = new Howl({ src: [erroSound]})
  const notify = (message, state) => {
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

  const handlePost = () => {
    if (postContent) {
       if (currentQuizObj) {
        const quizID = currentQuizObj.quizID
        const duration = currentQuizObj.duration
        handlePostAssignment(postContent, quizID, duration)
       }
    }else {
        const message = 'Please insert Content'
        notify(message, 'err')
    }
   
  }

  
  useEffect(()=>{
    postType && setShowQuizThumbnail(true)
  },[])

  return (
    <div className={style.container}>
        <ToastContainer/>
        <div className={style.horizontal}>
            <h2>Assignment</h2>
            <button onClick={handlePost}><IoIosSend/> Post</button>
        </div>
        <textarea cols="30" rows="10" placeholder='Write something...' value={postContent} onChange={(e) => setpostContent(e.target.value)}></textarea>
        {
            isShowQuizThumbnail && <div className={style.quiz}><SlNotebook/> {currentQuizObj.quizTitle}</div>
        }
        
        {
            currentPostType === 'schedule' && (
                <>
                    <p>Schedule Date</p>
                    <div className={style.horizontal}>
                        <BsCalendar3 className={style.icons}/>
                        <input type="date" className={style.dateInput}/>
                        <IoTimeOutline className={style.icons}/>
                        <input type="time" className={style.timeInput}/>
                    </div>
                    <p>Due Date</p>
                    <div className={style.horizontal}>
                        <BsCalendar3 className={style.icons}/>
                        <input type="date" className={style.dateInput}/>
                        <IoTimeOutline className={style.icons}/>
                        <input type="time" className={style.timeInput}/>
                    </div>
                    <p>Close Date</p>
                    <div className={style.horizontal}>
                        <BsCalendar3 className={style.icons}/>
                        <input type="date" className={style.dateInput}/>
                        <IoTimeOutline className={style.icons}/>
                        <input type="time" className={style.timeInput}/>
                    </div>
                    <p>Points</p>
                    <div className='d-flex gap-2 align-items-center'>
                        <GoStar className={style.icons}/>
                        <input type="number" className={style.pointsInput}/>
                    </div>
                </>
            )
        }
        
    </div>
  )
}

export default ClassAssignment