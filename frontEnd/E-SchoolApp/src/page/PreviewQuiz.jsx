import React, { useEffect, useState } from 'react'
import style from './PreviewQuiz.module.css'
import { BiSolidRightArrowAlt } from "react-icons/bi"

const PreviewQuiz = ({ onData, questionTitle, questionDescription, choices, questionObj}) => {

const questions = questionObj
const choice = choices



const totalQuestions = questions.length
const [questionNumber, setquestionNumber] = useState(1)
const [questionContent, setquestionContent] = useState('')
const [questionAnswer, setquestionAnswer] = useState('')
const [keySensitive, setkeySensitive] = useState(false)
const [points, setpoints] = useState(0)
const [required, setrequired] = useState(false)
const [choicesID, setchoicesID] = useState()
const [quizType, setquizType] = useState('start')

const [currentChoices, setcurrentChoices] = useState([])

const [backData, setbackData] = useState()
const [containsPic, setcontainsPic] = useState(false)
const [choicesAnswer, setChoicesAnswer] = useState()


const handleBackToGenerator = () => {
    setbackData(false)
    onData(backData) // passValue to parent
}

const handleStart = () => {
    const question = questions.filter(ques => ques.questionNumber === 1)
  
    setchoicesID(question[0].choicesID)
    setrequired(question[0].required)
    setpoints(question[0].setpoints)
    setquestionAnswer(question[0].questionAnswerText)
    setkeySensitive(question[0].keySensitive)
    setquizType(question[0].questionType)
    setquestionNumber(question[0].questionNumber)
    setquestionContent(question[0].questionContent)

    if (question[0].questionType === 'choices') {

        const tempData = choice.filter(data => data.choicesID === choicesID)
        setcurrentChoices(tempData)

    }
    
    
}

const handleNextQuestion = () => {
    console.log(choice)
    if (questionNumber < totalQuestions) {
        setContent(questionNumber)
    }else {
        console.log("The question number is: " + questionNumber + " and the max value is: " + totalQuestions) 
    }
    
}

const setContent = (number) => {
    const question = questions.filter(ques => ques.questionNumber === number+1)
    
    setchoicesID(question[0].choicesID)
    setrequired(question[0].required)
    setpoints(question[0].setpoints)
    setquestionAnswer(question[0].questionAnswerText)
    setkeySensitive(question[0].keySensitive)
    setquizType(question[0].questionType)
    setquestionNumber(parseInt(questionNumber) + 1)
    setquestionContent(question[0].questionContent)

    const tempData = choice.filter(data => data.choicesID === question[0].choicesID)
    setcurrentChoices(tempData)
}

  return (
    <div className={style.container}>
        <div className='mb-3 d-flex gap-2'>
            <button className='btn btn-primary' onClick={() => setquizType('start')}>start</button>
            <button className='btn btn-primary' onClick={() => setquizType('text')}>text</button>
            <button className='btn btn-primary' onClick={() => setquizType('choices')}>Choices</button>
            <button className='btn btn-primary' onClick={() => setquizType('fill')}>fill in the blank</button>
            <button className='btn btn-warning' onClick={() => setcontainsPic(!containsPic)}>{containsPic ? 'No Image' : 'Set Image'}</button>
        </div>
        
        {
            quizType === 'start' && (
                <div className={style.content}>
                    <p id={style.btnexit} onClick={() => handleBackToGenerator()}><i>Back <BiSolidRightArrowAlt/></i></p>
                    <h2>Quiz Title:</h2>
                    <h1>{questionTitle ? questionTitle : '(Insert Title)'}</h1>
                    <p>{questionDescription ? questionDescription : '(Insert Description)'}</p>
                    <div className={style.box}>
                        box
                    </div>
                    <button id={style.btnstart} onClick={handleStart}>Start</button>
                </div>
            )
        }

        {
            quizType === 'text' && containsPic === false &&(
                <div className={style.content}>
                    <h1 id={style.quizTitle}>{questionTitle}</h1>
                    <p id={style.quizDes}>{questionDescription}</p>
                    <div id={style.quizBox}>
                        <p id={style.itemNumber}>{questionNumber}/{totalQuestions}</p>
                        <p>Question:</p>
                        <h1>{questionContent}</h1>
                        <p><i>{keySensitive ? 'Key sensitive answer' : 'Not key sensitive.'}</i></p>
                        <h2>Answer:</h2>
                        <textarea value={questionAnswer} onChange={(e) => setquestionAnswer(e.target.value)}>
                        </textarea>
                    </div>
                    <button id={style.btnstart} onClick={handleNextQuestion}>Next</button>
                </div>
            )
        }

        {
            quizType === 'text' && containsPic === true && (
                <div className={style.content}>
                    <h1 id={style.quizTitle}>{questionTitle}</h1>
                    <p id={style.quizDes}>{questionDescription}</p>
                    <div id={style.quizBoxWImage}>
                        <div className={style.leftQuizText}>
                            <p id={style.itemNumber}>{questionNumber}/{totalQuestions}</p>
                            <p>Question:</p>
                            <h1>{questionContent}</h1>
                            <p><i>{keySensitive ? 'Key sensitive answer' : 'Not key sensitive.'}</i></p>
                            <div className={style.qTextImage}>
                                insert image
                            </div>
                        </div>
                        <div className={style.rightQuizText}>
                            <h2>Answer:</h2>
                            <textarea value={questionAnswer} onChange={(e) => setquestionAnswer(e.target.value)}>
                            </textarea>
                        </div>
                        
                    </div>
                    <button id={style.btnstart} onClick={handleNextQuestion}>Next</button>
                </div>
            )
        }

        {
            quizType === 'choices' && containsPic === false &&(
                <div className={style.content}>
                    <h1 id={style.quizTitle}>{questionTitle}</h1>
                    <p id={style.quizDes}>{questionDescription}</p>
                    <div className={style.contentBoxChoices}>
                        <p id={style.quesLabel}>Question:</p>
                        <p id={style.quesNum}>{questionNumber}/{totalQuestions}</p>
                        <h2 id={style.quesContent}>{questionContent}</h2>
                        <p id={style.reminder}><i>Answer must be 2.</i></p>
                        <p id={style.quesLabel}>Answer:</p>
                        <div id={style.ansChoices}>
                            <div id={style.leftSide}>
                                {
                                    currentChoices.map((choices, index) => (
                                        <button key={index} id={choicesAnswer === choices.letter ? style.btnAnsChoicesActive : style.btnAnsChoices} onClick={() => setChoicesAnswer(choices.letter)}>{choices.letter}. {choices.content}</button>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                    <button id={style.btnstart} onClick={handleNextQuestion}>Next</button>
                </div>
            )
        }

        {
            quizType === 'choices' && containsPic === true &&(
                <div className={style.content}>
                    <h1 id={style.quizTitle}>das</h1>
                    <p id={style.quizDes}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, tempore.</p>
                    <div className={style.contentBoxChoices}>
                        <p id={style.quesLabel}>Question:</p>
                        <p id={style.quesNum}>1/2</p>
                        <h2 id={style.quesContent}>What is 1+1 ?</h2>
                        <p id={style.reminder}><i>Answer must be 2. UniquesId: {choicesID}</i></p>
                        
                        <div id={style.ansChoices}> 
                            <div id={style.leftSide}>
                                <div id={style.imageContainer}>
                                    insert image
                                </div>
                            </div>
                            <div id={style.leftSide}>
                                <p id={style.quesLabel}>Answer:</p>
                                <button id={choicesAnswer === 'A' ? style.btnAnsChoicesActive : style.btnAnsChoices} onClick={() => setChoicesAnswer('A')}>A. two</button>
                                <button id={choicesAnswer === 'B' ? style.btnAnsChoicesActive : style.btnAnsChoices} onClick={() => setChoicesAnswer('B')}>B. two</button>
                                <button id={choicesAnswer === 'C' ? style.btnAnsChoicesActive : style.btnAnsChoices} onClick={() => setChoicesAnswer('C')}>C. two</button>
                                <button id={choicesAnswer === 'D' ? style.btnAnsChoicesActive : style.btnAnsChoices} onClick={() => setChoicesAnswer('D')}>D. two</button>
                            
                            </div>
                            
                        </div>
                    </div>
                    <button id={style.btnstart}>Next</button>
                </div>
            )
        }


        

        
    </div>
  )
}

export default PreviewQuiz