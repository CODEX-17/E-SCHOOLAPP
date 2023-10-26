import React, { useState } from 'react'
import style from './ClassPage.module.css'
import logo from '../assets/logo.png'
import whiteLogo from '../assets/logo-white.png'
import { BiSolidRightArrowAlt } from "react-icons/bi"

const ClassPage = () => {

const [isReminderShow, setisReminderShow] = useState(true)
const [isModalShow, setisModalShow] = useState(false)
const [textButton, settextButton] = useState('Create Class')


const handleCreateClass = () => {
    setisReminderShow(!isReminderShow)
    if (isReminderShow) {
        settextButton('Back')
    }else {
        settextButton('Create Class')
    }
}

const CreateClass = () => {
    setisModalShow(!isModalShow)    
}

  return (
    <div className={style.container}>

        {
            isModalShow && (
                <div className={style.modalContainer}>
                    <div className={style.modalContent}>
                        <h1>Create you Class</h1>
                        <p>Teachers have ownership of the class, while students actively engage as members. Within each class, you have the ability to generate quizzes, document student feedback, and share announcements.</p>
                        <label>Name:</label>
                        <input type="text" />
                        <br />
                        <label>Description(optional):</label>
                        <textarea id={style.desInput}   type="text"></textarea>
                        <div className={style.horMenu}>
                            <button id={style.btnCancel} onClick={CreateClass}>Cancel</button>
                            <button>Next</button>
                        </div>
                    </div>
                </div>
            )
        }
        

        <div className={style.header}>
            <h1>Class</h1>
            <button onClick={handleCreateClass}>{textButton}</button>
        </div>
            {
                isReminderShow ? (
                    <div className={style.reminder}>
                        <h2>ADD YOUR CLASS.</h2>
                    </div>
                ) : (
                    <div className={style.content}>
                        <h1 id={style.mainTitle}>Join or Create a Class</h1>
                        <div className={style.horizontal}>
                            <div className={style.card}>
                                <img src={logo} width={144} alt="logo" />
                                <h2>Create Class</h2>
                                <button onClick={CreateClass}>Create</button>
                            </div>
                            <div className={style.card}>
                                <img src={whiteLogo} width={144} alt="Whitelogo" />
                                <h2 id={style.joinText}>Join in Class with code</h2>
                                <input type="text" />
                                <button>Create</button>
                            </div>
                        </div>
                    </div>
                )
            }



        
    </div>
  )
}

export default ClassPage