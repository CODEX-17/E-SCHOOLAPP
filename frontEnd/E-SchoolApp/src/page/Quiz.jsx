import React, {useEffect, useState} from 'react'
import style from './Quiz.module.css'
import { BiSolidRightArrowAlt } from "react-icons/bi"
import { RiImageAddFill } from "react-icons/ri"
import { BsPlusCircleFill } from "react-icons/bs"
import { AiOutlineCloseCircle, AiFillCheckCircle } from "react-icons/ai"
import { useQuestionsStore } from '../stores/useQuestionsStore'
import { Howl, Howler } from "howler";
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Quiz = () => {
const [isShowChoices, setisShowChoices] = useState(false)
const [showQuizType, setshowQuizType] = useState('')
const [isNoChoices, setNoChoices] = useState(false)
const [finalChoices, setFinalChoices] = useState([{}])
const { addQuestions, addChoicesDataBase, getQuestion, questions } = useQuestionsStore();

const [letter, setLetter] = useState('A');
const [content, setContent] = useState('');
const [correct, setCorrect] = useState(false);

const [qNumber, setQNumber] = useState(1);
const [questionTitle, setQuestionTitle] = useState();
const [questionDescription, setQuestionDescription] = useState();
const [questionContent, setQuestionContent] = useState();
const [questionType, setquestionType]  = useState();
const [required, setrequired] = useState();
const [points, setpoints] = useState();

const [choices, setChoices] = useState([]) //obj
const [questionObj, setQuestionObj] = useState([]) //obj;

const notif = new Howl({ src: [notifSound]})
const errSound = new Howl({ src: [erroSound]})

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

const addCorrectAns = () => {
    setCorrect(true)
   
}

const handleCorrect = (isCorrect, index) => {
    const updatedChoices = [...choices];
    updatedChoices[index].correct = isCorrect;
    setChoices(updatedChoices);
    
}


const handleMenus = (choice) => {
    setshowQuizType(choice)
}

const addChoices = () =>{

    if (content) {
        if (letter !== 'A' || letter !== 'a') {
            setLetter(String.fromCharCode(letter.charCodeAt(0) + 1));
            //auto increment in letters//
        }

            setChoices([...choices, {
                questionID: parseInt(qNumber),
                letter,
                content,
                correct,
            }])
        
        setFinalChoices([...finalChoices, choices])
        setNoChoices(false)
        setContent('')
        
    }   
}

const handleSubmitQuestion = (e) => {
    e.preventDefault()
    const result = choices.map((choice) => choice.correct).filter((choice) => choice === true).length;

    if (result) {
        if (letter !== 'A') {
            if (questionTitle && questionDescription) {
    
                setQuestionObj([...questionObj,
                    {
                        questionTitle,
                        questionDescription,
                        questionContent,
                        questionNumber: parseInt(qNumber),
                        questionType: 'choices',
                        required,
                        points: parseInt(points),
                        choices,
                    },
                ])
                //reset//
                setChoices([])
                setLetter('A')
                setQuestionContent('')
                setpoints(0)
                setQNumber(parseInt(qNumber) + 1)
                const message = 'Question Successfully added!'
                notify(message, 'success')
            } else {
                const message = 'Quiz title and Quiz Description must be fill up!'
                notify(message, 'err')
            }
            
        }else {
            setNoChoices(true)
        }
    }else {
        const message = 'Choices must have at least one correct answer!'
        notify(message, 'err')
    }
   
}



const handleFinalQuestion = () => {
    console.log(questionObj)
    if(questionObj.length === 0){ 
        const message = 'Must have at least one question! Before saving'
        notify(message, 'err')
    }else {
        addQuestions(questionObj)
        const message = 'Question Successfully Saved!'
        notify(message, 'success')
    }
    
}

  return (
    <div className={style.container}>
        <div className={style.content}>
            <ToastContainer/>
            <div className={style.left}>
                <h1>Quiz Generator</h1>
                <h2 id={style.h2Top}>Quiz title:</h2>
                <input id={style.inputOne} type="text" required onChange={(e) => setQuestionTitle(e.target.value)}/>
                <h2>Quiz description:</h2>
                <textarea id={style.inputTwo} type="text" required onChange={(e) => setQuestionDescription(e.target.value)}></textarea>
                <p>Write the quiz description.</p>
                <div className={style.miniDash}>
                    <div className={style.topDash}>
                        <div className={style.leftDash}>
                            <h2 id={style.dashTitle}>Total questions:</h2>
                            <h2 id={style.dashContent}>{questionObj.length}</h2>
                        </div>
                        <div className={style.rightDash}>
                            <h2 id={style.dashTitle}>Current question:</h2>
                            <h2 id={style.dashContent}>{qNumber}</h2>
                        </div>
                    </div>
                    <div className={style.botDash}>
                        <div className={style.dashDetails}>
                            <h2 id={style.detailTitle}>Text quiz</h2>
                            <h2 id={style.detailContent}>5</h2>
                        </div>
                        <div className={style.dashDetails}>
                            <h2 id={style.detailTitle}>Choices quiz</h2>
                            <h2 id={style.detailContent}>5</h2>
                        </div>
                        <div className={style.dashDetails}>
                            <h2 id={style.detailTitle}>Fill in the blank</h2>
                            <h2 id={style.detailContent}>5</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.right}>
                <div className={style.horizontal}>
                    <button className={style.btnAddQuiz} onClick={() => setisShowChoices(true)}>Add quiz +</button>
                    <h1><i><u>preview</u></i><BiSolidRightArrowAlt/></h1>
                </div>

                {
                    isShowChoices && (
                        <div className={style.menu}>
                            <button className={style.btnMenu} onClick={() => handleMenus('text')}>Text quiz</button>
                            <button className={style.btnMenu} onClick={() => handleMenus('choices')}>Choices quiz</button>
                            <button className={style.btnMenu}>Fill in the blank</button>
                        </div>
                    )
                }

                {
                    showQuizType === 'text' && (
                        <div className={style.quizContainer}>
                            <div className={style.quizForm}>
                                <h1>Text Quiz</h1>
                                <div className={style.horLabel}>
                                    <h2>Question:</h2>
                                    <h2>Question number: {qNumber}</h2>
                                </div>
                                <div className={style.inputWithImage}>
                                    <RiImageAddFill className={style.icon} title='Upload Image'/>
                                    <textarea className={style.quesField} type="text" required></textarea>
                                </div>
                                
                                <h2 id={style.ansLabel}>Answer:</h2>
                                <textarea className={style.quesField} type="text" required></textarea>
                                <div className={style.horizontalMenus}>
                                    <h2>Points:</h2>
                                    <input id={style.pointsField} type="number" min='0' required/>
                                    <input type="Checkbox" style={{marginLeft: 20}} />
                                    <h2>Required</h2>
                                    <input type="Checkbox" />
                                    <h2>Key sensitive</h2>
                                </div>
                                <button className={style.btnAdd}>Add</button>
                            </div>
                        </div>
                    )
                }

                {
                    showQuizType === 'choices' && (
                        <div className={style.quizContainer}>
                            <div className={style.quizForm}>
                                <h1 id={style.choicesTitle}>Choices Quiz</h1>
                                <form id={style.form} action="" onSubmit={handleSubmitQuestion}>
                                <div className={style.horizontalLabel}>
                                    <h2>Question:</h2>
                                    <h2>Question number: {qNumber}</h2>
                                </div>
                                <textarea className={style.quesField} type="text" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} required></textarea>
                                <h2 id={style.answerLabel}>Answer:</h2>

                                <div className={style.listFinalChoices}>
                                    {
                                        choices.map((choice, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                            <h1 id={style.letter}>{choice.letter}</h1>
                                            <div className={style.finalChoicesItem}>{choice.content}</div>
                                            {
                                                choice.correct ? (
                                                    <AiFillCheckCircle className={style.check} onClick={() => handleCorrect(false, index)}/>
                                                ) : (
                                                    <AiOutlineCloseCircle color='red' className={style.check} onClick={() => handleCorrect(true, index)}/>
                                                )
                                                
                                            }
                                        </div>
                                        ))
                                    }

                                    {
                                        isNoChoices && (
                                            <p>Please Add Choices!</p>
                                        )
                                    }

                                </div>

                                <div className={style.choicesList}>
                    
                                    <div className={style.choicesItems}>
                                        <BsPlusCircleFill className={style.btnAddChoices} onClick={addChoices}/>
                                        <input type="text" className={style.answerField} value={content} onChange={(e) => setContent(e.target.value)}/>
                                    </div>


                                </div>
                               <div className={style.footer}>
                                    <div className={style.footerMenu}>
                                        <h2>Points:</h2>
                                        <input onChange={(e) => setpoints(e.target.value)} value={points} className={style.pointsField} type="number" min='0' required/>
                                        <input onChange={(e) => setrequired(e.target.checked)} checked={required} type="Checkbox" style={{marginLeft: 20, outline: 'none', border: 'none'}} />
                                        <h2>Required</h2>
                                        <button id={style.btnAdd} type='submit'>Add</button>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    )
                }
                
                
                
            </div>
            <button className={style.btnSave} onClick={handleFinalQuestion}>Save</button>
        </div>
    </div> 
  )
}
