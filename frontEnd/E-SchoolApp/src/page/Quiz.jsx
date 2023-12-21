import React, {useEffect, useState} from 'react'
import style from './Quiz.module.css'
import { BiSolidRightArrowAlt } from "react-icons/bi"
import { RiImageAddFill } from "react-icons/ri"
import { MdDelete } from "react-icons/md"
import { BsPlusCircleFill } from "react-icons/bs"
import { AiOutlineCloseCircle, AiFillCheckCircle } from "react-icons/ai"
import { Howl, Howler } from "howler";
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PreviewQuiz from './PreviewQuiz'
import axios from 'axios'
import logo from '../assets/logo.png'
import ListPreviewQuiz from './ListPreviewQuiz'
import PrintLayout from '../components/PrintLayout'
import { InfinitySpin } from  'react-loader-spinner';
import sample from '../assets/sample.jpg'


export const Quiz = () => {

const [isShowChoices, setisShowChoices] = useState(false)
const [showQuizType, setshowQuizType] = useState('')
const [showPreview, setshowPreview] = useState('generator')
const [isNoChoices, setNoChoices] = useState(false)
const [tempChoices, setTempChoices] = useState([])
const [isShowImageModal ,setisShowImageModal] = useState(false)
const [isShowThumbnail, setisShowThumbnail] = useState(false)
const [uniqueId, setuniqueId] = useState('')
const [allQuestionData, setAllQuestionData] = useState([])
const [showLoading, setShowLoading] = useState(false)

const [currentFillType, setCurrentFillType] = useState(true)
const [fillContent, setFillContent] = useState('')
const [fillLayoutSet, setfillLayoutSet] = useState([])
const [fillPosition, setfillPosition] = useState(1)

const [totalTextQuizzes, setTotalTextQuizzes] = useState(0)
const [totalChoicesQuizzes, setTotalChoicesQuizzes] = useState(0)
const [totalTORF, setTotalTORF] = useState(0)
const [totalFillIntheBlankQuizzes, setTotalFillIntheBlankQuizzes] = useState(0)

const [letter, setLetter] = useState('E');
const [content, setContent] = useState('');
const [correct, setCorrect] = useState(false);

const [quizTitle, setQuizTitle] = useState();
const [quizInstructions, setQuizInstructions] = useState();
const [questionContent, setQuestionContent] = useState();
const [subjectName, setsubjectName]  = useState();
const [subjectNameList, setsubjectNameList] = useState([])
const [required, setrequired] = useState(false);
const [points, setpoints] = useState(1);
const [questionAnswerText, setQuestionAnswerText] = useState();
const [keySensitive, setKeySensitive] = useState(false)
const [selectedImage, setSelectedImage] = useState(null)
const [imageSetQuestion, setImageSetQuestion] = useState([])
const [trueORFalseAnswer, setTrueOrFalseAnswer] = useState(null)

const [choices, setChoices] = useState([]) //obj
const [questionObj, setQuestionObj] = useState([]) //obj;
const [fillLayout, setFillLayout] = useState([]) //obj

const notif = new Howl({ src: [notifSound]})
const errSound = new Howl({ src: [erroSound]})



let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
let currentDate = new Date().toDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        weekday: 'short' 
})

const [choicesA, setChoicesA] = useState({
    choicesID: uniqueId,
    letter: 'A',
    content: '',
    correct: false,
})

const [choicesB, setChoicesB] = useState({
    choicesID: uniqueId,
    letter: 'B',
    content: '',
    correct: false,
})

const [choicesC, setChoicesC] = useState({
    choicesID: uniqueId,
    letter: 'C',
    content: '',
    correct: false,
})

const [choicesD, setChoicesD] = useState({
    choicesID: uniqueId,
    letter: 'D',
    content: '',
    correct: false,
})

useEffect(() => {
    generateUniqueId()
},[])

useEffect(()=>{
    getAnalytics()
    getSubjects()
    console.log(choicesA)
},[questionObj, choicesA])

const generateFullname = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const generated = user.firstname + ' '+ user.middlename.charAt(0) + '. '+ user.lastname
    return generated
}

const fullname = generateFullname()


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

const deleteAllData = () => {
    setQuestionObj([])
    setChoices([])
    setFillLayout([])
    setImageSetQuestion([])
    setsubjectName('')
    setQuizTitle('')
    setQuizInstructions('')
}

const getSubjects = () => {
    axios.get('http://localhost:5000/getSubjects')
    .then(res => setsubjectNameList(res.data))
    .catch(err => console.error(err))
}

const previewShow = (data) => {
    setshowPreview(data)
}

const handleDeleteChoices = (letter) => {
    let data = choices
    const filterData = data.filter((choice) => choice.letter !== letter)
    let updatedData = filterData

    for (let i = 0; i < filterData.length; i++) {
        const letter = String.fromCharCode(69 + i);
        updatedData[i].letter = letter
    }
    setTempChoices(updatedData)
    setChoices(updatedData)
}

const handleCorrect = (isCorrect, letter, Id) => {
    let updatedTempData = [...tempChoices]

   for (let x = 0; x < updatedTempData.length; x++) {
        if (updatedTempData[x].letter === letter) {
            updatedTempData[x].correct = isCorrect;
        }
   }
    setTempChoices(updatedTempData)
}

const handleMenus = (choice) => {
    setshowQuizType(choice)
    if (uniqueId.length === 0) {
        generateUniqueId()
    }
}

const handleChangetype = (e) => {
    e.preventDefault()
    setCurrentFillType(!currentFillType)
}

const resetValues = (level) => {
    if (level === 1) {
        const message = 'Question Successfully added!'
        notify(message, 'success')
    }else {
        setQuizTitle('')
        setQuizInstructions('')
        setQuestionObj([])
    }
        setfillPosition(1)
        setTrueOrFalseAnswer(null)
        setSelectedImage(null)
        setTempChoices([])
        generateUniqueId()
        setLetter('A')
        setQuestionContent('')
        setrequired(false)
        setKeySensitive(false)
        setpoints(1)
        setFillLayout([])
        setQuestionAnswerText('')
        setisShowThumbnail(false)
}

const getAnalytics = () => {
    const questions = questionObj.filter((question) => question.quizTitle === quizTitle)
    const text = questions.filter(question => question.questionType === 'text').length
    const choices = questions.filter(question => question.questionType === 'choices').length
    const fill = questions.filter(question => question.questionType === 'fill').length
    const torf = questions.filter(question => question.questionType === 'True Or False').length
    
    setTotalFillIntheBlankQuizzes(fill)
    setTotalChoicesQuizzes(choices)
    setTotalTextQuizzes(text)
    setTotalTORF(torf)
}

const handleImageModal = () => {
    setisShowImageModal(true)
}

const handleFileInputChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (file && isImageType(file)) {
        setSelectedImage(file)
    } else {
        const message = 'Only images are allowed'
        notify(message, 'err')
    }

}

const handleCancelImage = (e) => {
    e.preventDefault()
    setisShowImageModal(false)
}

const isImageType = (file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
    const extension = file.name.split('.').pop().toLowerCase()
    return allowedExtensions.includes(extension)
}

const handleUploadImage = (e) => {
    e.preventDefault()

    if (selectedImage) {
        imageSetQuestion.push({
            file: selectedImage,
            imageID: uniqueId,  
        })

        setisShowThumbnail(true)
        setisShowImageModal(false)
        const message = 'Image Uploaded successfully'
        notify(message, 'success')
        
    }else {
        const message = 'Please Insert Image before uploading'
        notify(message, 'err')
    }
    
}

const handleRemoveImage = () => {
    const filter = imageSetQuestion.filter(image => image.imageID != uniqueId)
    setImageSetQuestion(filter)
    setSelectedImage(null)
    setisShowThumbnail(false)
}

const handleSelectSubjectNamee = (e) => {
    setsubjectName(e)
}

const handleDisableUploadBtn = () => {
    const data = imageSetQuestion.filter(image => image.imageID === uniqueId)

    if (data.length > 0) {
        return true
    }else {
        return false
    }
}

const handleUpdatedQuestion = (ques, choicesSet, imageSet, fillLayout) => {
    if (ques) {
        setQuestionObj(ques)
        setQuizTitle(ques[0].quizTitle)
        setQuizInstructions(ques[0].quizInstructions)
        setsubjectName(ques[0].subjectName)
    }else {
        console.log('empty ques')
    }

    if (choicesSet) {
        setChoices(choicesSet)
    }else {
        console.log('empty choicesSet')
    }

    if (imageSet) {
        setImageSetQuestion(imageSet)
    }else {
        console.log('empty imageSet')
    }

    if (fillLayout) {
        setfillLayoutSet(fillLayout)
    }else {
        console.log('empty fillLayout')
    }
}

const handleAnswerTORF = (answer) => {
    setTrueOrFalseAnswer(answer)
}

const addFillLayout = (event) => {
    event.preventDefault()
    if (fillContent) {
        setFillLayout((prevData) => [...prevData, {
            fillType: currentFillType ? 'text' : 'blank',
            fillContent,
            fillPosition,
            fillLayoutID: uniqueId,
        }])
        setfillLayoutSet((prevData) => [...prevData, {
            fillType: currentFillType ? 'text' : 'blank',
            fillContent,
            fillPosition,
            fillLayoutID: uniqueId,
        }])
    }else {
        const message = 'Please insert content.'
        notify(message, 'err')
    }
    setfillPosition((preData) => preData + 1)
    setFillContent('')
}

const addChoices = () =>{
    const total = tempChoices.length
    const updatedLetter = String.fromCharCode(69 + total)

    if (content) {
        setLetter(String.fromCharCode(letter.charCodeAt(0)+1));
        setTempChoices([...tempChoices, {
            choicesID: uniqueId,
            letter: updatedLetter,
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

const handleFillLayoutQuestionAdd = (e) => {
    e.preventDefault()

    const ifImageSet = imageSetQuestion.filter((image) => image.imageID === uniqueId)
    let result = ifImageSet.length > 0 ? uniqueId : 'none'
    const num = questionObj.length

            if (subjectName) {
                if (fillLayout.length > 0) {
                    setQuestionObj([...questionObj,
                        {
                            questionID: uniqueId,
                            questionContent: 'none',
                            questionNumber: num+1,
                            questionType: 'fill',
                            required,
                            keySensitive,
                            points: parseInt(points),
                            questionAnswerText: 'none',
                            choicesID: 'none',
                            imageID: result,
                            fillLayoutID: uniqueId,
                            subjectName
                        }
                    ])
                    console.log(questionObj)
                    resetValues(1)
                }else {
                    const message = 'Please insert layout first before adding.'
                    notify(message, 'err')
                }
            }else {
                const message = 'You must provide subject'
                notify(message, 'err')
            }
   
}

const handleChoicesQuestionAdd = (e) => {
    e.preventDefault()
    
    let updatedChoices = []
    updatedChoices.push(choicesA)
    updatedChoices.push(choicesB)
    updatedChoices.push(choicesC)
    updatedChoices.push(choicesD)

    if (tempChoices) {
        for (let i = 0; i < tempChoices.length; i++) {
            updatedChoices.push(tempChoices[i])
        }
    }

    const isContainsTrue = updatedChoices.map((choice) => choice.correct).filter((choice) => choice === true).length;
    const haveImage = !selectedImage ? 'none' : uniqueId;
    const num = questionObj.length

    if (isContainsTrue) {
        if (updatedChoices.length > 0) {
                setQuestionObj([...questionObj,
                    {
                        questionID: uniqueId,
                        questionContent,
                        questionNumber: num+1,
                        questionType: 'choices',
                        required,
                        keySensitive: false,
                        points: parseInt(points),
                        questionAnswerText: 'none',
                        choicesID: uniqueId,
                        imageID: haveImage,
                        fillLayoutID: 'none',
                        subjectName,
                    }
                ])

                for (let x = 0; x < updatedChoices.length; x++) {
                    updatedChoices[x].choicesID = uniqueId;
                }

                for (let i = 0; i < updatedChoices.length; i++) {
                    choices.push(updatedChoices[i])
                }

                updatedChoices=[]
                resetValues(1)
                generateUniqueId()
                setChoicesA({
                    choicesID: uniqueId,
                    letter: 'A',
                    content: '',
                    correct: false,
                })
                setChoicesB({
                    choicesID: uniqueId,
                    letter: 'B',
                    content: '',
                    correct: false,
                })
                setChoicesC({
                    choicesID: uniqueId,
                    letter: 'C',
                    content: '',
                    correct: false,
                })
                setChoicesD({
                    choicesID: uniqueId,
                    letter: 'D',
                    content: '',
                    correct: false,
                })
                setTempChoices([])
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

const handleTextQuestionAdd = (e) => {
    e.preventDefault()
    
    const ifImageSet = imageSetQuestion.filter((image) => image.imageID === uniqueId)
    let result = ifImageSet.length > 0 ? uniqueId : 'none'
    const num = questionObj.length

        if (subjectName) {
            setQuestionObj([...questionObj,
                {
                    questionID: uniqueId,
                    questionContent,
                    questionNumber: num+1,
                    questionType: 'text',
                    required,
                    keySensitive,
                    points: parseInt(points),
                    questionAnswerText,
                    choicesID: 'none',
                    imageID: result,
                    fillLayoutID: 'none',
                    subjectName,
                }
            ])
            resetValues(1)
        }else {
            const message = 'You must select subject'
            notify(message, 'err')
        }

}

const handleTORFquestionAdd = (e) => {
    e.preventDefault()
    const ifImageSet = imageSetQuestion.filter((image) => image.imageID === uniqueId)
    let result = ifImageSet.length > 0 ? uniqueId : 'none'
    const num = questionObj.length

        if (subjectName) {
            if (questionContent) {
                if (trueORFalseAnswer !== null) {
                    setQuestionObj([...questionObj,
                        {
                            questionID: uniqueId,
                            questionContent,
                            questionNumber: num+1,
                            questionType: 'True Or False',
                            required,
                            keySensitive: 'none',
                            points: parseInt(points),
                            questionAnswerText: trueORFalseAnswer,
                            choicesID: 'none',
                            imageID: result,
                            fillLayoutID: 'none',
                            subjectName
                        }
                    ])
                    resetValues(1)
                }else {
                    const message = 'You must select either TRUE or FALSE'
                    notify(message, 'err')
                }
            }else {
                const message = 'Question is empty'
                notify(message, 'err')
            }

        }else {
            const message = 'You must select subject'
            notify(message, 'err')
        }

}

const computeTotalPoints = () => {
    let total = 0
    for (let i = 0; i < questionObj.length; i++) {
        const points = parseInt(questionObj[i].points);
        total += points
    }
    return total
}

const handleFinalQuestion = () => {
    setShowLoading(true)
    const id = uniqueId
    const totalPoints = computeTotalPoints()
    const totalQuestions = questionObj.length
    console.log('totalPoints:',totalPoints)

    if (quizTitle) {
        if (quizInstructions) {

            axios.post('http://localhost:5000/quiz', { quizTitle, quizInstructions, subjectName, fullname, id, totalPoints, totalQuestions, currentDate, currentTime } )
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

            if(questionObj.length > 0){ 
                for (let i = 0; i < questionObj.length; i++) {
                    const dataObj = questionObj[i]
                    axios.post('http://localhost:5000/questions', { dataObj, id } )
                    .then(res => {
                        resetValues(2)
                    })
                    .catch(err => console.log(err))
                }
                setTimeout(() => {
                    setShowLoading(false)
                    const message = `${questionObj.length} question Successfully Saved! `
                    notify(message, 'success')
                }, 3000);    
            }
        
            if (choices.length > 0 ) {
          
                for (let i = 0; i < choices.length; i++) {
                    const dataObj = choices[i]
                    axios.post('http://localhost:5000/choices', { dataObj } )
                    .then(res => {
                        console.log(res)
                        setChoices([])
                    })
                    .catch(err => console.log(err))
                }
            }
        
            if (imageSetQuestion.length > 0) {
                
                for (let i = 0; i < imageSetQuestion.length; i++) {
                    const { imageID, file} = imageSetQuestion[i]
                    const formData = new FormData()
                    formData.append('image', file)
                    formData.append('imageID', imageID)
        
                    axios.post('http://localhost:5000/upload', formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(response => {
                        console.log(response.data)
                        setImageSetQuestion([])
                    })
                    .catch(error => console.log(error))          
                }
            }
        
            if (fillLayoutSet.length > 0) {
                for (let i = 0; i < fillLayoutSet.length; i++) {
                    const data = fillLayoutSet[i];
                    axios.post('http://localhost:5000/fillLayout', { data } )
                    .then(res => {
                        console.log(res.data)
                        setfillLayoutSet([])
                    })
                    .catch(err => console.log(err))
                }
                
            }


        }else {
            const message = 'Insert quiz instructions.'
            notify(message, 'err')
        }
    }else {
        const message = 'Insert quiz title.'
        notify(message, 'err')
    }
}

  return (
    <>

            {
                showLoading && (
                    <div className={style.exitTrapNotif}>
                        <InfinitySpin 
                            width='200'
                            color="#099AED"
                        />
                        <h2>Loading...</h2>
                        <p>Saving the questions.</p>
                    </div>
                )
            }

        {
            showPreview === 'printLayout' && ( 
                <PrintLayout
                    className={style.ListPreviewQuiz}
                    previewShow={previewShow}
                    quizTitle={quizTitle}
                    quizInstructions={quizInstructions}
                    questionObj={questionObj}
                    choices={choices}
                    imageSetQuestion={imageSetQuestion}
                    fillLayoutSet={fillLayoutSet}
                    subjectNameList={subjectNameList}
                    handleUpdatedQuestion={handleUpdatedQuestion}
                    deleteAllData={deleteAllData}
                />
            )
        }

        {
            showPreview === 'previewList' && (
                <ListPreviewQuiz
                    className={style.ListPreviewQuiz}
                    previewShow={previewShow}
                    quizTitle={quizTitle}
                    quizInstructions={quizInstructions}
                    questionObj={questionObj}
                    choices={choices}
                    imageSetQuestion={imageSetQuestion}
                    fillLayoutSet={fillLayoutSet}
                    subjectNameList={subjectNameList}
                    handleUpdatedQuestion={handleUpdatedQuestion}
                    deleteAllData={deleteAllData}
                />
            )
        }
        {
            showPreview === 'preview' && (

                <PreviewQuiz 
                    id={style.previewQuiz}
                    onData={previewShow}
                    quizTitle={quizTitle}
                    quizInstructions={quizInstructions}
                    questionObj={questionObj}
                    choices={choices}
                    fillLayoutSet={fillLayoutSet}
                    imageSetQuestion={imageSetQuestion}
                />
            )  
        }
        {
            showPreview === 'generator' && (
                <div className={style.container}>
                    <div className={style.content}>
                        <ToastContainer/>
                        {
                            isShowImageModal && (
                                <div className={style.imageModal}>
                                    <div className='w-50 d-flex align-items-center justify-content-center h-50 p-2'>
                                        <img src={ selectedImage ? URL.createObjectURL(selectedImage) : logo } alt="" height={200}/>
                                    </div>
                                    <p>Upload Image</p>
                                
                                    <div className="input-group mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                            aria-describedby="inputGroupFileAddon03"
                                            aria-label="Upload"/>
                                    </div>
                                    <div className='d-flex gap-3'>
                                        
                                        {
                                            selectedImage && (
                                                <>
                                                    <button className='btn btn-primary' disabled={handleDisableUploadBtn()} onClick={handleUploadImage}>Upload</button>
                                                    <button className='btn btn-danger' onClick={handleRemoveImage}>Remove</button>
                                                </>
                                               
                                            ) 
                                        }
                                        <button className='btn btn-warning' onClick={handleCancelImage}>Cancel</button>
                                    </div>
                                </div>
                            )
                        }
                        <div className={style.left}>
                            <h1>Quiz Generator</h1>
                            <h2 id={style.h2Top}>Quiz title:</h2>
                            <input id={style.inputOne} value={quizTitle} type="text" required onChange={(e) => setQuizTitle(e.target.value)}/>
                            <h2>Instructions:</h2>
                            <textarea id={style.inputTwo} value={quizInstructions} type="text" required onChange={(e) => setQuizInstructions(e.target.value)}></textarea>
                            <p>Write the quiz description.</p>
                            <select className="form-select" id={style.select} value={subjectName} onChange={(e) => handleSelectSubjectNamee(e.target.value)}>
                                <option id={style.option} selected={subjectName ? false : true}>Select subject</option>
                                {
                                    subjectNameList.map((subject, index) => (
                                        <option id={style.option} key={index} selected={subjectName === subject.subjectName ? true : false} value={subject.subjectName}>{subject.subjectName}</option>
                                    ))
                                }
                            </select>
                            <div className={style.miniDash}>
                                <div id={style.divTitle}>
                                    <h1 id={style.quizTitle}>{quizTitle ? quizTitle : '(Quiz title)'}</h1>
                                </div>
                                <div className={style.topDash}>
                                    <div className={style.leftDash}>
                                        <h2 id={style.dashTitle}>Total questions:</h2>
                                        <h2 id={style.dashContent}>{questionObj.length}</h2>
                                    </div>
                                    <div className={style.rightDash}>
                                        <h2 id={style.dashTitle}>Current question:</h2>
                                        <h2 id={style.dashContent}>{questionObj.length+1}</h2>
                                    </div>
                                </div>
                                <div className={style.botDash}>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>Text quiz</h2>
                                        <h2 id={style.detailContent}>{questionObj.filter((q)=> q.questionType === 'text').length}</h2>
                                    </div>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>Choices quiz</h2>
                                        <h2 id={style.detailContent}>{questionObj.filter((q)=> q.questionType === 'choices').length}</h2>
                                    </div>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>Fill in the blank</h2>
                                        <h2 id={style.detailContent}>{questionObj.filter((q)=> q.questionType === 'fill').length}</h2>
                                    </div>
                                    <div className={style.dashDetails}>
                                        <h2 id={style.detailTitle}>True Or False</h2>
                                        <h2 id={style.detailContent}>{questionObj.filter((q)=> q.questionType === 'True Or False').length}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div className={style.right}>
                            <div className={style.horizontal}>
                                <button className={style.btnAddQuiz} onClick={() => setisShowChoices(true)}>Add quiz +</button>
                                {
                                    questionObj.length > 0 && (
                                        <h1 onClick={() => previewShow('preview')}><i><u>preview</u></i><BiSolidRightArrowAlt/></h1>
                                    )
                                }
                                
                            </div>
            
                            {
                                isShowChoices && (
                                    <div className={style.menu}>
                                        <button className={showQuizType === 'text' ? style.btnMenuActived : style.btnMenu } onClick={() => handleMenus('text')}>Text quiz</button>
                                        <button className={showQuizType === 'choices' ? style.btnMenuActived : style.btnMenu } onClick={() =>  handleMenus('choices')}>Choices quiz</button>
                                        <button className={showQuizType === 'fill' ? style.btnMenuActived : style.btnMenu }  onClick={() => handleMenus('fill')}>Fill in the blank</button>
                                        <button className={showQuizType === 'TOrF' ? style.btnMenuActived : style.btnMenu }  onClick={() => handleMenus('TOrF')}>True Or False</button>
                                    </div>
                                )
                            }
            
                            {
                                showQuizType === 'text' && (
                        
                                    <div className={style.quizContainer}>
                                        <form id={style.formControl} action="" onSubmit={handleTextQuestionAdd}>
                                        <div className={style.quizForm}>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <h1>Text Quiz</h1>
                                                {
                                                    isShowThumbnail && (<img src={URL.createObjectURL(selectedImage)} alt="thumbnail" id={style.thumbnail}/>)
                                                }
                                                
                                            </div>
                                            <div className={style.horLabel}>
                                                <h2>Question:</h2>
                                                <h2>Question number: {questionObj.length+1}</h2>
                                            </div>
                                            <div className={style.textareaDiv}>
                                                <textarea className={style.quesField} type="text" required value={questionContent} onChange={(e) => setQuestionContent(e.target.value)}></textarea>
                                                <RiImageAddFill id={style.iconImageChoices} title='Upload Image' onClick={handleImageModal}/>
                                            </div>
                                            
                                            <h2 id={style.ansLabel}>Answer:</h2>
                                            <textarea className={style.quesField} type="text" required value={questionAnswerText} onChange={(e) => setQuestionAnswerText(e.target.value)}></textarea>
                                            <div className={style.horizontalMenus}>
                                                <h2>Points:</h2>
                                                <input value={points} id={style.pointsField} type="number" min='1' required onChange={(e) => setpoints(e.target.value)}/>
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
                                showQuizType === 'TOrF' && (
                        
                                    <div className={style.quizContainer}>
                                       
                                            <div className={style.quizForm}>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <h1 id={style.trueFalseLabel}>True Or False</h1>
                                                    {
                                                        isShowThumbnail && (<img src={URL.createObjectURL(selectedImage)} alt="thumbnail" id={style.thumbnail}/>)
                                                    }
                                                </div>
                                                <div className={style.horLabel}>
                                                    <h2>Question:</h2>
                                                    <h2>Question number: {questionObj.length+1}</h2>
                                                </div>
                                                <div className={style.textareaDiv}>
                                                    <textarea className={style.quesField} type="text" required value={questionContent} onChange={(e) => setQuestionContent(e.target.value)}></textarea>
                                                    <RiImageAddFill id={style.iconImageChoices} title='Upload Image' onClick={handleImageModal}/>
                                                </div>
                                                
                                                <h2 id={style.ansLabel}>Answer:</h2>
                                                <div className='d-flex gap-5 align-items-center justify-content-center mt-5'>
                                                    <button className={ trueORFalseAnswer === true ? style.btnTORFActive : style.btnTORF } onClick={() => handleAnswerTORF(true)}>True</button>
                                                    <button className={ trueORFalseAnswer === false ? style.btnTORFActive : style.btnTORF} onClick={() => handleAnswerTORF(false)}>False</button>
                                                </div>
                                                <div className={style.footer}>
                                                    <div className={style.footerMenu}>
                                                        <h2>Points:</h2>
                                                        <input onChange={(e) => setpoints(e.target.value)} value={points} className={style.pointsField} type="number" min='1' required/>
                                                        <input onChange={(e) => setrequired(e.target.checked)} checked={required} type="Checkbox" style={{marginLeft: 20, outline: 'none', border: 'none'}} />
                                                        <h2>Required</h2>
                                                        <button id={style.btnAdd} type='submit' onClick={handleTORFquestionAdd}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                
                                    </div>
                                )
                            }
            
                            {
                                showQuizType === 'choices' && (
                                    <div className={style.quizContainer}>
                                        <div className={style.quizForm}>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <h1 id={style.choicesTitle}>Choices Quiz</h1>
                                                {
                                                    isShowThumbnail && (<img src={URL.createObjectURL(selectedImage)} alt="thumbnail" id={style.thumbnail}/>)
                                                }
                                            </div>
                                            
                                            <form id={style.form} action="" onSubmit={handleChoicesQuestionAdd}>
                                            <div className={style.horizontalLabel}>
                                                <h2>Question:</h2>
                                                <h2>Question number: {questionObj.length+1}</h2>
                                            </div>
                                            <div className={style.textareaDiv}>
                                                <textarea className={style.quesField} type="text" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} required></textarea>
                                                <RiImageAddFill id={style.iconImageChoices} title='Upload Image' onClick={handleImageModal}/>
                                            </div>
                                            
                                            <h2 id={style.answerLabel}>Answer:</h2>
            
                                            <div className={style.listFinalChoices}>

                                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                                        <h1 id={style.letter}>A</h1>
                                                        <input 
                                                            className={style.finalChoicesItem}
                                                            placeholder='insert answer'
                                                            value={choicesA.content}
                                                            required
                                                            onChange={(e) => setChoicesA((prevData) => ({...prevData, content: e.target.value}))}
                                                        />
                                                            {
                                                                choicesA.correct ? (
                                                                    <AiFillCheckCircle
                                                                        className={style.check}
                                                                        title='make it correct answer'
                                                                        onClick={() => setChoicesA((prevData) => ({...prevData, correct: false}))}
                                                                    />
                                                                ) : (
                                                                    <AiOutlineCloseCircle 
                                                                        color='red'
                                                                        title='make it correct answer'
                                                                        className={style.check}
                                                                        onClick={() => setChoicesA((prevData) => ({...prevData, correct: true}))}
                                                                    />
                                                                )
                                                            }

                                                    </div>
                                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                                        <h1 id={style.letter}>B</h1>
                                                        <input 
                                                            className={style.finalChoicesItem}
                                                            placeholder='insert answer'
                                                            required
                                                            value={choicesB.content}
                                                            onChange={(e) => setChoicesB((prevData) => ({...prevData, content: e.target.value}))}
                                                        />
                                                            {
                                                                choicesB.correct ? (
                                                                    <AiFillCheckCircle
                                                                        className={style.check}
                                                                        title='make it correct answer'
                                                                        onClick={() => setChoicesB((prevData) => ({...prevData, correct: false}))}
                                                                    />
                                                                ) : (
                                                                    <AiOutlineCloseCircle 
                                                                        color='red'
                                                                        title='make it correct answer'
                                                                        className={style.check}
                                                                        onClick={() => setChoicesB((prevData) => ({...prevData, correct: true}))}
                                                                    />
                                                                )
                                                            }
                    
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                                        <h1 id={style.letter}>C</h1>
                                                        <input 
                                                            className={style.finalChoicesItem}
                                                            placeholder='insert answer'
                                                            required
                                                            value={choicesC.content}
                                                            onChange={(e) => setChoicesC((prevData) => ({...prevData, content: e.target.value}))}
                                                        />
                                                            {
                                                                choicesC.correct ? (
                                                                    <AiFillCheckCircle
                                                                        className={style.check}
                                                                        title='make it correct answer'
                                                                        onClick={() => setChoicesC((prevData) => ({...prevData, correct: false}))}
                                                                    />
                                                                ) : (
                                                                    <AiOutlineCloseCircle 
                                                                        color='red'
                                                                        title='make it correct answer'
                                                                        className={style.check}
                                                                        onClick={() => setChoicesC((prevData) => ({...prevData, correct: true}))}
                                                                    />
                                                                )
                                                            }
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                                        <h1 id={style.letter}>D</h1>
                                                        <input 
                                                            className={style.finalChoicesItem}
                                                            placeholder='insert answer'
                                                            required
                                                            value={choicesD.content}
                                                            onChange={(e) => setChoicesD((prevData) => ({...prevData, content: e.target.value}))}
                                                        />
                                                            {
                                                                choicesD.correct ? (
                                                                    <AiFillCheckCircle
                                                                        className={style.check}
                                                                        title='make it correct answer'
                                                                        onClick={() => setChoicesD((prevData) => ({...prevData, correct: false}))}
                                                                    />
                                                                ) : (
                                                                    <AiOutlineCloseCircle 
                                                                        color='red'
                                                                        title='make it correct answer'
                                                                        className={style.check}
                                                                        onClick={() => setChoicesD((prevData) => ({...prevData, correct: true}))}
                                                                    />
                                                                )
                                                            }
                                                    </div>

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
                                                            <MdDelete className={style.btnDeleteChoices} title='delete choices' onClick={() => handleDeleteChoices(choice.letter)}/>
                                                        </div>
                                                        ))
                                                    }

        
                                                {
                                                    isNoChoices && (
                                                        <p>Please Add Choices!</p>
                                                    )
                                                }
            
                                            </div>
 
                                                <div className={style.choicesItems}>
                                                    <BsPlusCircleFill className={style.btnAddChoices} onClick={addChoices}/>
                                                    <input type="text" className={style.answerField} placeholder='insert new choices' value={content} onChange={(e) => setContent(e.target.value)}/>
                                                </div>
            
                                            <div className={style.footer}>
                                                <div className={style.footerMenu}>
                                                    <h2>Points:</h2>
                                                    <input onChange={(e) => setpoints(e.target.value)} value={points} className={style.pointsField} type="number" min='1' required/>
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

                            {
                                showQuizType === 'fill' && (
                                    <div className={style.fillContainer}>
                                        <div className={style.fillContent}>
                                            <div className='d-flex align-items-center justify-content-between mb-4'>
                                                <h1 id={style.choicesTitle}>fill in the blank</h1>
                                                {
                                                    isShowThumbnail && (<img src={URL.createObjectURL(selectedImage)} alt="thumbnail" id={style.thumbnail}/>)
                                                }
                                            </div>
                                            <form id={style.form} action="" onSubmit={handleFillLayoutQuestionAdd}>
                                            <div className={style.horizontalLabel}>
                                                <h2>Question:</h2>
                                                <h2>Question number: {questionObj.length+1}</h2>
                                            </div>
                                                {
                                                    fillLayout.length > 0 ? (
                                                        <div className={style.questionFillContainer}>
                                                            <div className={style.fillContentQues}>
                                                                {
                                                                    fillLayout.map((fill, index) => (
                                                                        fill.fillType === 'text' ? (
                                                                            <h2 key={index}>{fill.fillContent}</h2> 
                                                                        ) : (
                                                                            <h2 key={index} id={style.fillBlank}><u>{fill.fillContent}</u></h2> 
                                                                        )
                                                                    ))
                                                                }
                                                            </div>
                                                            <RiImageAddFill id={style.iconfillQuiz} title='Upload Image' onClick={handleImageModal}/>
                                                        </div>
                                                    ): (
                                                        <br/>
                                                    )
                                                }
                                            
                                            <div className={style.generatorFillLayout}>
                                                <h2>Generate fill in the blank layout:</h2>

                                                <div className={style.fillDiv}>
                                                    <button id={style.btnFront} disabled>{currentFillType ? 'Text' : 'Blank'}</button>
                                                    <input 
                                                        id={style.inputContentF} 
                                                        type="text" 
                                                        placeholder={currentFillType ? 'insert text' : 'insert answer'}
                                                        value={fillContent}
                                                        onChange={(e) => setFillContent(e.target.value)}
                                                    />
                                                    <button id={style.btnBack} onClick={(event) => addFillLayout(event)}>Add</button>
                                                </div>
                                                <button
                                                    className={style.btnBlankInsert}
                                                    onClick={(e) => handleChangetype(e)}>{currentFillType ? 'Change to blank' : 'Change to text'}
                                                </button>
                                            </div>
            
                                            <div className={style.footer}>
                                                    <div className={style.footerMenu}>
                                                        <h2>Points:</h2>
                                                        <input onChange={(e) => setpoints(e.target.value)} value={points} className={style.pointsField} type="number" min='1' required/>
                                                        <input onChange={(e) => setrequired(e.target.checked)} checked={required} type="Checkbox" style={{marginLeft: 20, outline: 'none', border: 'none'}} />
                                                        <h2>Required</h2>
                                                        <input type="Checkbox" onChange={(e) => setKeySensitive(e.target.checked)} checked={keySensitive}/>
                                                        <h2>Key sensitive</h2>
                                                        <button id={style.btnAdd} type='submit'>Add</button>
                                                    </div>
                                                </div>
                                                </form>
                                            </div>
                                    </div>
                                )
                            }
                            
                            
                            
                        </div>
                        
                    </div>
                    <div className={style.menuButtons}>
                        <button className={style.btnSave} disabled={questionObj.length <= 0 ? true : false} onClick={() => previewShow('previewList')}>Edit</button>
                        <button className={style.btnSave} disabled={questionObj.length <= 0 ? true : false} onClick={handleFinalQuestion}>Save</button>    
                    </div>
                </div>   
            )
        }

    </>
  )
}
