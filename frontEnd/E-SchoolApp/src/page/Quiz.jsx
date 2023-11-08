import React, {useEffect, useState} from 'react'
import style from './Quiz.module.css'
import { BiSolidRightArrowAlt } from "react-icons/bi"
import { RiImageAddFill } from "react-icons/ri"
import { MdDelete } from "react-icons/md"
import { BsPlusCircleFill } from "react-icons/bs"
import { AiOutlineCloseCircle, AiFillCheckCircle } from "react-icons/ai"
import { useRandomID } from '../stores/useRandomID'
import { Howl, Howler } from "howler";
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PreviewQuiz from './PreviewQuiz'
import axios from 'axios'

export const Quiz = () => {

const [isShowChoices, setisShowChoices] = useState(false)
const [showQuizType, setshowQuizType] = useState('')
const [showPreview, setshowPreview] = useState(false)
const [isNoChoices, setNoChoices] = useState(false)
const [tempChoices, setTempChoices] = useState([])
const [isShowImageModal ,setisShowImageModal] = useState(false)
const [uniqueId, setuniqueId] = useState('')
const [allQuestionData, setAllQuestionData] = useState([])


const [totalTextQuizzes, setTotalTextQuizzes] = useState(0)
const [totalChoicesQuizzes, setTotalChoicesQuizzes] = useState(0)
const [totalFillIntheBlankQuizzes, setTotalFillIntheBlankQuizzes] = useState(0)

const [letter, setLetter] = useState('A');
const [content, setContent] = useState('');
const [correct, setCorrect] = useState(false);

const [qNumber, setQNumber] = useState(1);
const [questionTitle, setQuestionTitle] = useState();
const [questionDescription, setQuestionDescription] = useState();
const [questionContent, setQuestionContent] = useState();
const [questionType, setquestionType]  = useState();
const [required, setrequired] = useState(false);
const [points, setpoints] = useState(0);
const [questionAnswerText, setQuestionAnswerText] = useState();
const [keySensitive, setKeySensitive] = useState(false)
const [selectedImage, setSelectedImage] = useState(null)
const [imageSetQuestion, setImageSetQuestion] = useState([])

const [choices, setChoices] = useState([]) //obj
const [questionObj, setQuestionObj] = useState([]) //obj;

const notif = new Howl({ src: [notifSound]})
const errSound = new Howl({ src: [erroSound]})

useEffect(()=>{
    getAnalytics()
},[questionObj])


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

const generateUniqueId = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8
    let result = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        result += charset.charAt(randomIndex)
    }
    setuniqueId(result)
}

const handleChildData = (data) => {
    setshowPreview(data)
}

const handleDeleteChoices = (letter, id) => {
    let updatedTempData = [...tempChoices]

    updatedTempData = updatedTempData.filter(choice => !(choice.uniqueId === id && choice.letter === letter))

    updatedTempData.sort((a, b) => a.letter.localeCompare(b.letter))

    for (let i = 0; i < updatedTempData.length; i++) {
        updatedTempData[i].letter = String.fromCharCode(97 + i).toUpperCase()
        
    }
    const num = updatedTempData.length
    setLetter(String.fromCharCode(97 + num).toUpperCase())
    console.log(updatedTempData)
    setTempChoices(updatedTempData)


    updateDeletedChoices(updatedTempData)
}

const updateDeletedChoices = (updatedTempData) => {
    let updatedData = [...choices]
    const newData = updatedTempData

    console.log("updatedTempData : ", updatedTempData)
    console.log("oldDAta : ", updatedData)

    const remainsData = updatedData.filter(choices => choices.choicesID !== updatedTempData[0].choicesID)
    setChoices([...remainsData, ...newData])
    
} 

const handleCorrect = (isCorrect, letter, Id) => {
    let updatedData = [...choices]
    let updatedTempData = [...tempChoices]

    for (let i = 0; i < updatedData.length; i++) {
        if (updatedData[i].uniqueId === Id && updatedData[i].letter === letter) {
            updatedData[i].correct = isCorrect
        }   
    }

   for (let x = 0; x < updatedTempData.length; x++) {
        if (updatedTempData[x].letter === letter) {
            updatedTempData[x].correct = isCorrect;
        }
   }
    setChoices(updatedData)
    setTempChoices(updatedTempData)

    console.log("updatedChoices : ", choices)
    console.log("updatedTempChoices : " ,tempChoices)
}

const handleMenus = (choice) => {
    setshowQuizType(choice)
    if (uniqueId.length === 0) {
        generateUniqueId()
    }
}

const addChoices = () =>{

    if (content) {
        setLetter(String.fromCharCode(letter.charCodeAt(0) + 1));
        setChoices([...choices, {
            choicesID: uniqueId,
            letter,
            content,
            correct,
        }])
        setTempChoices([...tempChoices, {
            choicesID: uniqueId,
            letter,
            content,
            correct,
        }])
        setNoChoices(false)
        setContent('')
    }else {
        const message = 'Choices must have content.'
        notify(message, 'err')
    }
}

const handleSubmitQuestion = (e) => {
    e.preventDefault()
    const isContainsTrue = choices.map((choice) => choice.correct).filter((choice) => choice === true).length;

    if (isContainsTrue) {
        if (choices.length > 0) {
            if (questionTitle && questionDescription) {
                
                setQuestionObj([...questionObj,
                    {
                        questionTitle,
                        questionDescription,
                        questionContent,
                        questionNumber: parseInt(qNumber),
                        questionType: 'choices',
                        required,
                        keySensitive: false,
                        points: parseInt(points),
                        questionAnswerText: 'none',
                        choicesID: uniqueId,
                        imageID: uniqueId,
                    }
                ])

                resetValues(1)
                generateUniqueId()

            } else {
                const message = 'Quiz title and Quiz Description must be fill up!'
                notify(message, 'err')
            }
            
        }else {
            setNoChoices(true)
            const message = 'Must add choices!'
            notify(message, 'err')
        }
    }else {
        const message = 'Choices must have atleast one correct answer!'
        notify(message, 'err')
    }
   
}

const resetValues = (level) => {
    if (level === 1) {
        setQNumber(parseInt(qNumber) + 1)
        const message = 'Question Successfully added!'
        notify(message, 'success')
    }else {
        setQuestionTitle('')
        setQuestionDescription('')
        setQNumber(1)
        const message = 'Question Successfully Saved!'
        notify(message, 'success')
        setQuestionObj([])
    }

        setTempChoices([])
        generateUniqueId()
        setLetter('A')
        setQuestionContent('')
        setrequired(false)
        setKeySensitive(false)
        setpoints(0)
        setQuestionAnswerText('')
    
}

const handleTextQuizAdd = (e) => {
    e.preventDefault()
    const ifImageSet = imageSetQuestion.filter((image) => image.imageID === uniqueId)
    let result = ''
    {ifImageSet.length > 0 ? result = uniqueId : result = 'none'}

    if (questionTitle && questionDescription) {
        setQuestionObj([...questionObj,
            {
                questionTitle,
                questionDescription,
                questionContent,
                questionNumber: parseInt(qNumber),
                questionType: 'text',
                required,
                keySensitive,
                points: parseInt(points),
                questionAnswerText,
                choicesID: 'none',
                imageID: result,
            }
        ])

        resetValues(1)
    }else {
        const message = 'Quiz title and Quiz Description must be fill up!'
        notify(message, 'err')
    }
        
    
}

const handleFinalQuestion = () => {

    console.log("choices :",choices)
    console.log("questions :",questionObj)

    if(questionObj.length === 0){ 
        const message = 'Must have at least one question! Before saving'
        notify(message, 'err')
    }else {
        for (let i = 0; i < questionObj.length; i++) {
            const dataObj = questionObj[i]

            axios.post('http://localhost:5000/questions', { dataObj } )
            .then(res => {
                console.log(res)
                resetValues(2)
            })
            .catch(err => console.log(err))
        }
    }

    if (choices.length > 0 ) {
        console.log(choices)
        for (let i = 0; i < choices.length; i++) {
            const dataObj = choices[i]

            axios.post('http://localhost:5000/choices', { dataObj } )
            .then(res => {
                console.log(res)
                setChoices([])
            })
            .catch(err => console.log(err))
        }
    }else {
        console.log('The CHOICES is empty')
    }

    if (imageSetQuestion.length > 0) {
        const { imageID, file} = imageSetQuestion[0]
        console.log(file)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('imageID', imageID)

        axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        .then(response => console.log(response.data))
        .catch(error => console.log(error))
    }
    
}

const getAllDataQuestion = () => {
    axios.get('http://localhost:5000/getQuestion')
        .then(res => setAllQuestionData(res.data))
        .catch(err => console.log(err))
}

const getAnalytics = () => {
    const questions = questionObj.filter((question) => question.questionTitle === questionTitle)
    const text = questions.filter(question => question.questionType === 'text').length
    const choices = questions.filter(question => question.questionType === 'choices').length
    const fill = questions.filter(question => question.questionType === 'fill').length
    
    setTotalFillIntheBlankQuizzes(fill)
    setTotalChoicesQuizzes(choices)
    setTotalTextQuizzes(text)
}

const handleImageModal = () => {
    setisShowImageModal(true)
}

const handleFileInputChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    file && setSelectedImage(file)
}

const handleCancelImage = (e) => {
    e.preventDefault()
    setisShowImageModal(false)
    setSelectedImage(null)
}

const handleUploadImage = (e) => {
    e.preventDefault()

    if (selectedImage) {
        imageSetQuestion.push({
            file: selectedImage,
            imageID: uniqueId,
        })

        setisShowImageModal(false)
        setSelectedImage(null)
        const message = 'Image Uploaded successfully'
        notify(message, 'success')

    }else {
        const message = 'Please Insert Image before'
        notify(message, 'err')
    }
    
}

  return (
    <>
        {
            showPreview ? (
                <PreviewQuiz 
                    onData={handleChildData}
                    questionTitle={questionTitle}
                    questionDescription={questionDescription}
                    questionObj={questionObj}
                    choices={choices}
                />
            ) : 
            (
                <div className={style.container}>
                    <div className={style.content}>
                        <ToastContainer/>
                        <div className={style.left}>
                            <h1>Quiz Generator</h1>
                            <h2 id={style.h2Top}>Quiz title:</h2>
                            <input id={style.inputOne} value={questionTitle} type="text" required onChange={(e) => setQuestionTitle(e.target.value)}/>
                            <h2>Quiz description:</h2>
                            <textarea id={style.inputTwo} value={questionDescription} type="text" required onChange={(e) => setQuestionDescription(e.target.value)}></textarea>
                            <p>Write the quiz description.</p>
                            <div className={style.miniDash}>
                                <div className={style.topDash}>
                                    <h1 id={style.quizTitle}>{questionTitle ? questionTitle : '(Quiz title)'}</h1>
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
                                        <h2 id={style.detailContent}>{totalTextQuizzes}</h2>
                                    </div>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>Choices quiz</h2>
                                        <h2 id={style.detailContent}>{totalChoicesQuizzes}</h2>
                                    </div>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>Fill in the blank</h2>
                                        <h2 id={style.detailContent}>{totalFillIntheBlankQuizzes}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div className={style.right}>
                            <div className={style.horizontal}>
                                <button className={style.btnAddQuiz} onClick={() => setisShowChoices(true)}>Add quiz +</button>
                                <h1 onClick={() => setshowPreview(!showPreview)}><i><u>preview</u></i><BiSolidRightArrowAlt/></h1>
                            </div>
            
                            {
                                isShowChoices && (
                                    <div className={style.menu}>
                                        <button className={style.btnMenu} onClick={() => handleMenus('text')}>Text quiz</button>
                                        <button className={style.btnMenu} onClick={() =>  handleMenus('choices')}>Choices quiz</button>
                                        <button className={style.btnMenu}>Fill in the blank</button>
                                    </div>
                                )
                            }
            
                            {
                                showQuizType === 'text' && (
                        
                                    <div className={style.quizContainer}>
                                        <form action="" onSubmit={handleTextQuizAdd}>
                                        <div className={style.quizForm}>
                                            {
                                                isShowImageModal && (
                                                    <div className={style.imageModal}>
                                                        <p>Upload Image</p>
                                                    
                                                        <div class="input-group mb-3">
                                                            <input 
                                                                type="file"
                                                                class="form-control"
                                                                accept="image/*"
                                                                onChange={handleFileInputChange}
                                                                aria-describedby="inputGroupFileAddon03"
                                                                aria-label="Upload"/>
                                                        </div>
                                                        <div className='d-flex gap-3'>
                                                            <button className='btn btn-primary' onClick={handleUploadImage}>Upload</button>
                                                            <button className='btn btn-warning' onClick={handleCancelImage}>Cancel</button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                            <h1>Text Quiz</h1>
                                            <div className={style.horLabel}>
                                                <h2>Question:</h2>
                                                <h2>Question number: {qNumber}</h2>
                                            </div>
                                            <div className={style.inputWithImage}>
                                                <RiImageAddFill className={style.icon} title='Upload Image' onClick={handleImageModal}/>
                                                <textarea className={style.quesField} type="text" required onChange={(e) => setQuestionContent(e.target.value)}></textarea>
                                            </div>
                                            
                                            <h2 id={style.ansLabel}>Answer:</h2>
                                            <textarea className={style.quesField} type="text" required onChange={(e) => setQuestionAnswerText(e.target.value)}></textarea>
                                            <div className={style.horizontalMenus}>
                                                <h2>Points:</h2>
                                                <input id={style.pointsField} type="number" min='0' required onChange={(e) => setpoints(e.target.value)}/>
                                                <input type="Checkbox" style={{marginLeft: 20}} onChange={(e) => setrequired(e.target.checked)} checked={required} />
                                                <h2>Required</h2>
                                                <input type="Checkbox" onChange={(e) => setKeySensitive(e.target.checked)} checked={keySensitive}/>
                                                <h2>Key sensitive</h2>
                                            </div>
                                            <button className={style.btnAdd} type='submit'>Add</button>
                                        </div>
                                        </form>
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
                                                    tempChoices.map((choice, index) => (
                                                    <div key={index} style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                                        <h1 id={style.letter}>{choice.letter}</h1>
                                                        <div className={style.finalChoicesItem}>{choice.content}</div>
                                                        {
                                                            choice.correct ? (
                                                                <AiFillCheckCircle className={style.check} title='make it correct answer' onClick={() => handleCorrect(false, choice.letter, choice.uniqueId)}/>
                                                            ) : (
                                                                <AiOutlineCloseCircle color='red' title='make it correct answer' className={style.check} onClick={() => handleCorrect(true, choice.letter, choice.uniqueId)}/>
                                                            )
                                                            
                                                        }
                                                        <MdDelete className={style.btnDeleteChoices} title='delete choices' onClick={() => handleDeleteChoices(choice.letter, choice.uniqueId)}/>
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

    </>
  )
}
