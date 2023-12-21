import React, { useEffect, useState } from 'react'
import style from './ClassQuizSetup.module.css'
import { LuTimer } from "react-icons/lu";
import { useQuizStore } from '../stores/useQuizStore';


const ClassQuizSetup = ({ subjectName, navigateClass }) => {
  const currentSubjectName = subjectName
  const choices = JSON.parse(localStorage.getItem('choices'))
  const questions = JSON.parse(localStorage.getItem('questions'))
  const quiz = JSON.parse(localStorage.getItem('quiz'))
  const images = JSON.parse(localStorage.getItem('images'))
  const [currentQuiz, setcurrentQuiz] = useState('')
  const [questionSelected, setquestionSelected] = useState(null)
  const [selectedQuiz, setselectedQuiz] = useState('')
  const { getQuiz } = useQuizStore()
  const fillLayout = JSON.parse(localStorage.getItem('fillLayout'))
  const [isShowDurationBox, setisShowDurationBox] = useState(false)
  const [duration, setduration] = useState(0)

  useEffect( () => {
    getQuiz()
    const filter = quiz.filter((q) => q.subjectName === currentSubjectName)
    setcurrentQuiz(filter)
  },[])

  const handleQuestionSelected = (target) => {
    const filter = currentQuiz.filter((questions, index) => index === target)
    setselectedQuiz(filter[0])
  }
  
  return (
    <div className={style.container}>
        <div className={style.top}>
            <div className={style.left}>
                <h2 className={style.subjectLabel}>{currentSubjectName}</h2>
                <div className={style.listCards}>
                    {
                        currentQuiz.length > 0?
                            currentQuiz?.map((question, index) => (
                                <div className={selectedQuiz && selectedQuiz.quizID === question.quizID ? style.cardActive : style.card} onClick={() => handleQuestionSelected(index)}>
                                    <div className={style.title}>
                                        <h2>{question.quizTitle}</h2>
                                        <p>{question.quizInstructions}</p>
                                    </div>
                                    <div className={style.created}>
                                        <p>Created by : {question.creator}</p>
                                        <p>{question.time} ({question.date})</p>
                                    </div>
                                </div>
                            ))
                        : 'No quiz created.'
                    }
                    

                </div>
                <div className={style.dashboard}>
                    <div className={style.leftDash}>
                        <p>Total Questions</p>
                        <h2>
                            {
                                selectedQuiz? questions
                                .filter((q) => q.questionID === selectedQuiz.questionID)
                                .length 
                                : '0'
                            }
                        </h2>
                    </div>
                    <div className={style.rightDash}>
                        <div className={style.horizontal}>
                            <div className={style.vertical}>
                                <h2>Text Quiz</h2>
                                <p>
                                    {
                                        selectedQuiz? questions
                                        .filter((q) => q.questionID === selectedQuiz.questionID && q.questionType === 'text')
                                        .length 
                                        : '0'
                                    }
                                </p>
                            </div>
                            <div className={style.vertical}>
                                <h2>Choices Quiz</h2>
                                <p>
                                    {
                                        selectedQuiz? questions
                                        .filter((q) => q.questionID === selectedQuiz.questionID && q.questionType === 'choices')
                                        .length 
                                        : '0'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className={style.horizontal}>
                            <div className={style.vertical}>
                                <h2>Fill in the Blank</h2>
                                <p>
                                    {
                                        selectedQuiz? questions
                                        .filter((q) => q.questionID === selectedQuiz.questionID && q.questionType === 'fill')
                                        .length 
                                        : '0'
                                    }
                                </p>
                            </div>
                            <div className={style.vertical}>
                                <h2>True OR False</h2>
                                <p>
                                    {
                                        selectedQuiz? questions
                                        .filter((q) => q.questionID === selectedQuiz.questionID && q.questionType === 'True Or False')
                                        .length 
                                        : '0'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.right}>
               <div className={style.box}>
                <div className={style.header}>
                    <h2>{selectedQuiz? selectedQuiz.quizTitle : 'Quiz Title'}</h2>
                    <p>{selectedQuiz? selectedQuiz.quizInstructions : 'Instructions...'}</p>
                </div>
                <div className={style.list}>
                    {
                        selectedQuiz?
                        selectedQuiz && questions
                            .filter((q) => q.questionID === selectedQuiz.questionID)
                            .map((q, index) => (
                                <div className={style.cardQuest} key={index}>
                                    <div id={style.circle}>{q.questionNumber}</div>
                                    <p>{q.questionContent}</p>
                                    <div className={style.typeQuest}>{q.questionType}</div>
                                </div>
                            ))
                        : 'no selected quiz.'
                    }
                   
                </div>
               </div>
            </div>
        </div> 
        <div className={style.bottom}>
            {
                isShowDurationBox && (
                    <div className={style.leftBot}>
                        <div 
                            className={duration === 0 ? style.radioMinutesActive : style.radioMinutes}
                            onClick={() => setduration(0)}
                            >No limit</div>
                        <div 
                            className={duration === 15 ? style.radioMinutesActive : style.radioMinutes}
                            onClick={() => setduration(15)}
                            >15 Minutes</div>
                        <div 
                            className={duration === 30 ? style.radioMinutesActive : style.radioMinutes}
                            onClick={() => setduration(30)}
                            >30 Minutes</div>
                        <div 
                            className={duration === 40 ? style.radioMinutesActive : style.radioMinutes}
                            onClick={() => setduration(40)}
                            >40 Minutes</div>
                        <div 
                            className={duration === 60 ? style.radioMinutesActive : style.radioMinutes}
                            onClick={() => setduration(60)}
                            >60 Minutes</div>
                    </div>
                )
            }

            <button id={style.btnSetDurations} onClick={()=> setisShowDurationBox(!isShowDurationBox)}><LuTimer/> Set Duration</button>
            {
                selectedQuiz &&  (
                    <>
                        <button onClick={() => navigateClass('assignment', 'schedule',{ 
                            quiz: {
                                quizID: selectedQuiz.quizID,
                                quizTitle: selectedQuiz.quizTitle,
                                duration,
                            }} 
                            
                        )}>Schedule</button>
                         <button onClick={() => navigateClass('assignment', 'post',{ 
                            quiz: {
                                quizID: selectedQuiz.quizID,
                                quizTitle: selectedQuiz.quizTitle,
                                duration,
                            }} 
                            
                        )}>Post Now</button>
                    </>
                )
            }
            
        </div>
    </div>
  )
}

export default ClassQuizSetup