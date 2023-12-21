import React, { useEffect, useState } from 'react'
import style from './ListPreviewQuiz.module.css'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import { FaFileImage } from "react-icons/fa6"
import { BiExit } from "react-icons/bi"
import { MdPreview } from "react-icons/md"
import sample from '../assets/sample.jpg'
import ContentLayoutEdit from '../components/ContentLayoutEdit'
import ContentChoicesEdit from '../components/ContentChoicesEdit'
import { FaCirclePlus } from "react-icons/fa6";
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3';
import { ToastContainer, toast } from 'react-toastify';
import { InfinitySpin } from  'react-loader-spinner';
import { MdDeleteForever } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";



const ListPreviewQuiz = ({ quizInstructions, quizTitle, deleteAllData, subjectNameList, handleUpdatedQuestion, choices, questionObj, imageSetQuestion, previewShow, fillLayoutSet }) => {

const notif = new Howl({ src: [notifSound]})
const errSound = new Howl({ src: [erroSound]})
const [imageSet, setImageSet] = useState(imageSetQuestion)
const [choicesSet, setchoicesSet] = useState(choices)
const [questionSet, setquestionSet] = useState(questionObj)
const [isShowEditor, setisShowEditor] = useState(false)
const [showAddLayout, setShowAddLayout] = useState(false)
const [selectedQuestion, setselectedQuestion] = useState()
const [showAddChoice, setshowAddChoice] = useState(false)
const [currentChoices, setcurrentChoices] = useState(null)

const [updatedchoicesID, setupdatedchoicesID] = useState(null)
const [fillLayout, setfillLayout] = useState(fillLayoutSet)
const [updatedimageID, setupdatedimageID] = useState(null)
const [updatedKeySensitive, setupdatedKeySensitive] = useState(null)
const [updatedPoints, setupdatedPoints] = useState(0)
const [updatedquestionAnswerText, setupdatedquestionAnswerText] = useState(null)
const [updatedquestionContent, setupdatedquestionContent] = useState(null)
const [quizInstructionsFinal, setquizInstructionsFinal] = useState(quizInstructions)
const [updatedQuestionNumber, setupdatedQuestionNumber] = useState(null)
const [quizTitleFinal, setquizTitleFinal] = useState(quizTitle)
const [updatedType, setupdatedType] = useState(null)
const [updatedrequired, setupdatedrequired] = useState(null)
const [subjectNameFinal, setsubjectNameFinal] = useState(questionSet[0].subjectName)

const [edittingPosition, setedittingPosition] = useState(null)
const [edittingContent, setedittingContent] = useState(null)
const [addContentFill, setaddContentFill] = useState(null)
const [addTypeFill, setaddTypeFill] = useState('text')

const [edittingLetter, setEdittingLetter] = useState(null)
const [edittingchoicesID, setedittingchoicesID] = useState(null)
const [edittingContentChoices, setEdittingContentChoices] = useState(null)
const [edittingCorrect, setEdittingCorrect] = useState(null)

const [addContenChoice, setaddContenChoice] = useState(null)
const [addCorrectChoice, setaddCorrectChoice] = useState(false)

const [enable, setEnable] = useState(true) // choices btn
const [enableFill, setEnableFill] = useState(true)

const [imageDisplay, setImageDisplay] = useState()

const [isShowTitleEditor, setisShowTitleEditor] = useState(false)
const [showChangeImageModal, setshowChangeImageModal] = useState(false)
const [showModalAnnouncement, setshowModalAnnouncement] = useState(false)
const [showLoading, setshowLoading] = useState(false)
const [showDeleteAllmodal, setshowDeleteAllmodal] = useState(false)
const [changes, setchanges] = useState(false)

// useEffect(() => {
//     console.log('choicesSet:' ,choicesSet)
// },[choicesSet])

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

const exitTrapNotif = () => {
    console.log(changes)
    if (changes === true) {
        setshowModalAnnouncement(true)
    }else {
        previewShow('generator')
    }
}

const disableButton = (data) => {
    setEnable(data)
}

const disableButtonFill = (data) => {
    setEnableFill(data)
}

const handleDeleteChoice = (target) => {
    const filter = choicesSet.filter((fill, index) => index !== target)
    let updatedData = filter

    for (let i = 0, pos = 1; i < filter.length; i++) {
        updatedData[i].letter = String.fromCharCode(i + 'A'.charCodeAt(0))
    }
    setchoicesSet(updatedData)
}

const handleAddChoices = () => {
    if (addContenChoice) {
        const size = parseInt(choicesSet?.length)
        const letter = String.fromCharCode(size + 'A'.charCodeAt(0))
        const choicesID = choicesSet[0]?.choicesID
        const correct = !addCorrectChoice ? false : addCorrectChoice === 'true' ? true : false

        const updatedData = {
            choicesID,
            content: addContenChoice,
            correct: correct,
            letter,
        }

        setchoicesSet((prevData) => [...prevData, updatedData])
    }else {
        console.log('empty')
    }
}

console.log(addTypeFill)

const handleAddLayout = () => {

    if (addContentFill) {
        
        const fillLayoutID = fillLayout[0].fillLayoutID
        const fillPosition = fillLayout.length+1
        const fillType = addTypeFill
        let updatedData = fillLayout
    
        console.log(fillPosition)
        updatedData.push({
            fillContent: addContentFill,
            fillLayoutID,
            fillPosition,
            fillType: fillType,
        })
        console.log(updatedData)
        setfillLayout(updatedData)
        setShowAddLayout(false)
        setaddTypeFill('text')
    }else {
        console.log('empty')
    }
}

const handleDeleteLayout = (target) => {
    const filter = fillLayout.filter((fill, index) => index !== target)
    let updatedData = []
    console.log('filter:', filter)

    for (let i = 0, pos = 1; i < filter.length; i++) {
        let data = filter[i]
        data.fillPosition = pos
        pos++
        updatedData.push(data)
    }

    setfillLayout(updatedData)
}

const handleDeleteQuestion = (data) => {
    let filter = questionSet.filter((questions, index) => index !== data).sort()

    for (let i = 0; i < filter.length; i++) {
        filter[i].questionNumber = i+1
    }

        setquestionSet(filter)
        setchanges(true)
        const message = 'Successfully question deleted.'
        notify(message, 'success')
}

const handleEdit = (data) => {
    const filter = questionSet.filter((question, index) => index === data)
    const imageFile = imageSet.filter((image) => image.imageID === filter[0].imageID).map((image) => image.file)

    setselectedQuestion(filter)
    setupdatedrequired(filter[0]?.required)
    setupdatedKeySensitive(filter[0]?.keySensitive)
    setupdatedPoints(parseInt(filter[0]?.points))
    setupdatedquestionAnswerText(filter[0]?.questionAnswerText)
    setupdatedquestionContent(filter[0]?.questionContent)
    setupdatedchoicesID(filter[0]?.choicesID)
    setupdatedimageID(filter[0]?.imageID)
    setupdatedQuestionNumber(parseInt(filter[0]?.questionNumber))
    setisShowEditor(true)
    setImageDisplay(imageFile)

    if (filter[0]?.choicesID !== 'none') {
        const data = choicesSet.filter((choices) => choices.choicesID === filter[0].choicesID)
        setcurrentChoices(data)
    }

}


const handleSaveChange = (e) => {
    e.preventDefault()
    
    const choicesID = selectedQuestion[0].choicesID
    const fillLayoutID = selectedQuestion[0].fillLayoutID
    const imageID = updatedimageID ? updatedimageID : selectedQuestion[0].imageID
    let keySensitive = updatedKeySensitive ? updatedKeySensitive : selectedQuestion[0].keySensitive
    const points = updatedPoints ? updatedPoints : selectedQuestion[0].points
    let questionAnswerText = updatedquestionAnswerText ? updatedquestionAnswerText : selectedQuestion[0].questionAnswerText
    const questionContent = updatedquestionContent ? updatedquestionContent : selectedQuestion[0].questionContent
    const questionDescription = quizInstructionsFinal ? quizInstructionsFinal : selectedQuestion[0].questionDescription
    const questionNumber = updatedQuestionNumber ? parseInt(updatedQuestionNumber) : parseInt(selectedQuestion[0].questionNumber)
    const questionTitle = quizTitleFinal ? quizTitleFinal : selectedQuestion[0].questionTitle
    const questionType = selectedQuestion[0].questionType
    const required = updatedrequired ? updatedrequired : selectedQuestion[0].required
    const subjectName = subjectNameFinal ? subjectNameFinal : selectedQuestion[0].subjectName

    if (questionType === 'True Or False') {
        questionAnswerText = updatedquestionAnswerText
    }

    if (selectedQuestion[0].questionType === 'choices') {
        keySensitive = false
    }
        const selectedPosition = parseInt(selectedQuestion[0]?.questionNumber)-1
        const targetPosition = parseInt(questionNumber)-1
        const selectedData = questionSet.filter((question) => question.questionNumber === parseInt(selectedQuestion[0]?.questionNumber))
        const restData = questionSet.filter((question) => question.questionNumber !== parseInt(selectedQuestion[0]?.questionNumber))
        let updatedDATA = []
        for (let i = 0, int = 0; i < questionSet.length; i++) {
            if (i === targetPosition) {
                updatedDATA.push({
                    choicesID,
                    fillLayoutID,
                    imageID,
                    keySensitive,
                    points,
                    questionAnswerText,
                    questionContent,
                    questionDescription,
                    questionNumber,
                    questionTitle,
                    questionType,
                    required,
                    subjectName,
                })
            }else {
                updatedDATA.push({
                    choicesID: restData[int].choicesID,
                    fillLayoutID: restData[int].fillLayoutID,
                    imageID: restData[int].imageID,
                    keySensitive: restData[int].keySensitive,
                    points: restData[int].points,
                    questionAnswerText: restData[int].questionAnswerText,
                    questionContent: restData[int].questionContent,
                    questionDescription: restData[int].questionDescription,
                    questionNumber: i+1,
                    questionTitle,
                    questionType: restData[int].questionType,
                    required: restData[int].required,
                    subjectName,
                })
                int++
            }
            
        }
        setquestionSet(updatedDATA)
        setisShowEditor(false)
        setchanges(true)
        const message = 'Successfully saved changes.'
        notify(message, 'success')
}



const handleFinalEdittedQuestions = () => {
    handleUpdatedQuestion(questionSet, choicesSet, imageSet, fillLayout)
    setchanges(false)
    setshowLoading(true)
    setTimeout(() => {
        previewShow('generator')
    }, 3000)
}

const handleUpdateHeaderTitle = () => { 
    setisShowTitleEditor(!isShowTitleEditor)
    let updatedData = questionObj

    for (let i = 0; i < questionObj.length; i++) {
        updatedData[i].questionTitle = quizTitleFinal
        updatedData[i].questionDescription = quizInstructionsFinal
        updatedData[i].subjectName = subjectNameFinal
    }
    setquestionSet(updatedData)
    setchanges(true)
    const message = 'Successfully saved.'
    notify(message, 'success')
}


const handleShowTitleFill = (id) => {
    const data = fillLayout.filter((fill) => fill.fillLayoutID === id)
    console.log(data[0].fillContent)
    return data[0].fillContent.substring(0, 7) + '...'
}

const handleChangeCatchImgUpload = (e) => {
    e.preventDefault()
    const file = e.target.files
    setImageDisplay(file)
}

const handleChangeImage = () => {
    const id = selectedQuestion[0].imageID
    let updatedData = imageSet

    for (let i = 0; i < imageSet.length; i++) {
        if (updatedData[i].imageID === id) {
            updatedData[i].file = imageDisplay[0]
        }
    }
    setImageSet(updatedData)
    setshowChangeImageModal(false)
}

const handleOpenChangeImage = () => {
    setshowChangeImageModal(true)
    const imageID = selectedQuestion[0].imageID
    const filter = imageSet.filter(image => image.imageID === imageID).map((image) => image.file)
    setImageDisplay(filter)
}

const handleDeleteAll = () => {
    setshowDeleteAllmodal(true)
}

const shortenContent = (data) => {
    const dataLength = data.match(/[a-zA-Z0-9]/g).length
    return dataLength > 40 ? data.substring(0, 40)+'...' : data
}

const handleEditedChoices = (data) => {
    setcurrentChoices(data)
}

const handleAddChoicesEditor = () => {
    setshowAddChoice(!showAddChoice)
    if (enable) {
        setEnable(true)
    }
}

  return (
    <div className={style.container}>
        <div className={style.content}>
        <ToastContainer/>
            {
                showChangeImageModal && (
                    <div className={style.changeImageContainer}>
                        <div className={style.headerImagePic}>
                            <div className='d-flex gap-2 align-items-center'>
                                <p>Change Image</p>
                                <p id={style.quesImage}>{`(Question number : ${selectedQuestion[0].questionNumber})`}</p>
                            </div>
                            
                            <BiExit size={20} title='closed' cursor={'pointer'} onClick={() => setshowChangeImageModal(false)}/>
                        </div>
                        <img src={imageDisplay ? URL.createObjectURL(imageDisplay[0]) : sample} alt="image" id={style.imgChangePic}/>
                        <input type="file" accept='image/*' id={style.imgUpload} onChange={handleChangeCatchImgUpload}/>
                        <button className={style.btnChangeImage} onClick={handleChangeImage}>Change Image</button>
                    </div>
                )
            }

            {
                showModalAnnouncement && (
                    <div className={style.exitTrapNotif}>
                        <h2>Are you sure you want to exit?</h2>
                        <p>Note: When you proceed to exit the changes will not saved.</p>
                        <div className='d-flex gap-2'>
                            <button onClick={() => previewShow('generator')}>Yes</button>
                            <button id={style.btnNO} onClick={() => setshowModalAnnouncement(false)}>No</button>
                        </div>
                        
                    </div>
                )
            }

            {
                showLoading && (
                    <div className={style.exitTrapNotif}>
                        <InfinitySpin 
                            width='200'
                            color="#099AED"
                        />
                        <h2>Loading...</h2>
                        <p>Saving the data changes.</p>
                    </div>
                )
            }

            {
                showDeleteAllmodal && (
                    <div className={style.exitTrapNotif}>
                        <RiDeleteBin5Fill size={100}/>
                        <h2>Delete All Questions?</h2>
                        <p>Note: All the questions has been deleted.</p>
                        <div className='d-flex gap-2'>
                            <button onClick={() => {
                                deleteAllData()
                                previewShow('generator')
                            }}>Yes</button>
                            <button id={style.btnNO} onClick={() => setshowDeleteAllmodal(false)}>No</button>
                        </div>
                    </div>
                )
            }

            <div className={style.cardBucket}>
            <button id={style.btnDeleteAll} onClick={handleDeleteAll}><MdDeleteForever /> Delete all</button>
            {
                 questionSet.map((question, index) => (
                    <div className={style.card} key={index}>
                        <div className={style.left}>
                            <div className={style.cicle}>{question.questionNumber}</div>
                            <h2>{question.questionType === 'fill' ? handleShowTitleFill(question.fillLayoutID) : shortenContent(question.questionContent)}</h2>
                        </div>
                        <div className={style.right}>
                            {question.imageID != 'none' && <FaFileImage title='with image' color='#099AED'/> }
                            <div className={style.rounded}  title='Quiz type: Choices'>{question.questionType}</div>
                            <div className={style.editMenu}>
                                {
                                    questionSet.length > 1 && (
                                        <div id={style.boxIcon}>
                                            <AiOutlineDelete id={style.icons} onClick={() => handleDeleteQuestion(index)}/>
                                        </div>
                                    )
                                }
                                
                                <div id={style.boxIcon}>
                                    <FiEdit id={style.iconsEdit} onClick={() => handleEdit(index)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                 ))
     
            }
               
 
            </div>
            <div className={style.editPanel}>
                <h1 className={style.titleQuizEditor}>Quiz Editor</h1>
                <div className={style.header}>

                    {
                        isShowTitleEditor ? (
                            <div className={style.titleEditorContainer}>
                                <div className='col-5 d-flex gap-1 flex-column p-2 justify-content-center'>
                                    <p id={style.label}>Quiz title:</p>
                                    <input className={style.inputQuizTitle} value={quizTitleFinal} type="text" onChange={(e) => setquizTitleFinal(e.target.value)}/>
                                    <p id={style.label}>Subject:</p>
                                    <select id={style.selectTitleEditor} value={subjectNameFinal} onChange={(e) => setsubjectNameFinal(e.target.value)}>
                                        {
                                            subjectNameList.map((subject, index) => (
                                                <option key={index} value={subject.subjectName}>{subject.subjectName}</option>
                                            ))
                                        }
                                    </select>
                                    <button id={style.btnSaveTitle} onClick={handleUpdateHeaderTitle}>Save</button>
                                </div>
                                <div className='col-7 d-flex flex-column p-2 justify-content-center'>
                                    <p id={style.label}>Instruction:</p>
                                    <textarea type="text" value={quizInstructionsFinal} className={style.inputQuizDecs} onChange={(e) => setquizInstructionsFinal(e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <div className={style.titleHeader}>
                                <div className='d-flex'>
                                    <div className={style.titleBox}>
                                        <p>Quiz title</p>
                                        <h2>{quizTitleFinal}</h2>
                                    </div>
                                    <div className={style.titleBox}>
                                        <p>Subject</p>
                                        <h2>{subjectNameFinal}</h2>
                                    </div>
                                </div>
                                <div className={style.descBox}>
                                    Instruction: {quizInstructionsFinal}
                                </div>
                                <div className={style.editDiv}>
                                    <FiEdit id={style.editTitleIcon}
                                        onClick={() => {
                                            setisShowTitleEditor(!isShowTitleEditor)
                                            setisShowEditor(false)
                                    }}/>
                                </div>
                            </div>
                        )
                    }

                </div>
                {
                    isShowEditor === true && selectedQuestion[0].questionType === 'text' && (
                        <div className={style.cardQuestionEdit}>
                            <div className={style.bgCard}>
                                <div className='col-3'>
                                    <div className={style.quesTypeCard}>
                                        <p id={style.quizTypeLabel}>Question type:</p>
                                        <div className={style.rectangle}>Text Quiz </div>
                                    </div>
                                </div>  
                                <div className='d-flex flex-column col-8 align-items-end justify-content-center'>
                                    <div className={style.quesTypeCard}>
                                        <p id={style.quizTypeLabel}>Question number:</p>
                                        <div className={style.rectangle}>
                                            <select className={style.select} onChange={(e) => setupdatedQuestionNumber(e.target.value)}>
                                                {
                                                    questionSet.map((question, index) => (
                                                        <option
                                                            selected={question.questionNumber === selectedQuestion[0].questionNumber ? true : false}
                                                            value={question.questionNumber}
                                                            key={index}>Question no.{question.questionNumber}
                                                        </option> 
                                                    ))
                                                }
                                                
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.changeByType}>
                                <div className={style.fromQuestion}>
                                    <h2 id={style.questionLabel}>Question</h2>
                                    <input 
                                        id={style.inputQuestion}
                                        type="text"
                                        value={updatedquestionContent}
                                        onChange={(e) => setupdatedquestionContent(e.target.value)}
                                    />
                                </div>
                                <div className={style.fromQuestion}>
                                    <h2 id={style.questionLabel}>Answer</h2>
                                    <textarea
                                        id={style.inputAnswer}
                                        type="text"
                                        value={updatedquestionAnswerText}
                                        onChange={(e) => setupdatedquestionAnswerText(e.target.value)}
                                    />
                                </div>
                                <div className='d-flex align-items-center p-1'>
                                    <div className='d-flex gap-1 align-items-center'>
                                        <p id={style.questionLabel2}>Points:</p>
                                        <input 
                                            type="number"
                                            min='0'
                                            id={style.inputPoints} 
                                            value={updatedPoints}
                                            onChange={(e) => setupdatedPoints(e.target.value)}
                                        />
                                    </div>
                                    <div className='d-flex align-items-center gap-1' style={{ marginLeft: '20%'}}>
                                        <p id={style.questionLabel2}>Required: </p>
                                        <select id={style.select} value={updatedrequired} onChange={(e) => setupdatedrequired(e.target.value)}>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                    <div className='d-flex align-items-center gap-1' style={{ marginLeft: '5%'}}>
                                        <p id={style.questionLabel2}>KeySensitive</p>
                                        <select id={style.select} value={updatedKeySensitive} onChange={(e) => setupdatedKeySensitive(e.target.value)}>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='mt-2 d-flex justify-content-end align-items-center position-relative'>
                                    {
                                        selectedQuestion[0].imageID !== 'none' && (
                                            <div className={style.imgDiv}>
                                                <img src={imageDisplay ? URL.createObjectURL(imageDisplay[0]) : sample } alt="" width={20} height={20} id={style.miniViewImg}/>
                                                <button id={style.btnChangeImg} onClick={handleOpenChangeImage}>Change Image</button>
                                            </div>
                                        )
                                    }
                                    <button className={style.btnSaveChanges} onClick={(event) => handleSaveChange(event)}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    isShowEditor === true && selectedQuestion[0].questionType === 'choices' && (
                        <div className={style.cardQuestionEdit}>
                        <div className={style.bgCard}>
                            <div className='col-3'>
                                <div className={style.quesTypeCard}>
                                    <p id={style.quizTypeLabel}>Question type:</p>
                                    <div className={style.rectangle}>Choices Quiz</div>
                                </div>
                            </div>  
                            <div className='d-flex flex-column col-8 align-items-end justify-content-center'>
                                <div className={style.quesTypeCard}>
                                    <p id={style.quizTypeLabel}>Question number:</p>
                                    <div className={style.rectangle}>
                                    <select className={style.select} onChange={(e) => setupdatedQuestionNumber(e.target.value)}>
                                        {
                                            questionSet.map((question, index) => (
                                                <option
                                                    selected={question.questionNumber === selectedQuestion[0].questionNumber ? true : false}
                                                    value={question.questionNumber}
                                                    key={index}>Question no.{question.questionNumber}
                                                </option> 
                                            ))
                                        }
                                        
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.changeByType}>
                            <div className={style.fromQuestion}>
                                <h2 id={style.questionLabel}>Question</h2>
                                <input 
                                    id={style.inputQuestion}
                                    type="text"
                                    value={updatedquestionContent}
                                    onChange={(e) => setupdatedquestionContent(e.target.value)}
                                />
                            </div>
                            <div className={style.horizontalContainer}>
                                <div className={style.leftChoicesContainer} style={{ flex: enable ? '100%' : '40%'}}>
                                    <div className='d-flex justify-content-between align-items-end'>
                                        <p>Choices:</p>
                                        {
                                            enable && (
                                                <button id={style.btnAddChoices}
                                                    onClick={handleAddChoicesEditor}>
                                                        {showAddChoice ? 'back' : 'add'}
                                                </button>
                                                )
                                        }
                                        
                                    </div>
                                    <div className={style.listChoices}>
                                        {
                                            showAddChoice && enable &&(
                                                <div className={style.cardChoiceEditor}>
                                                    <input 
                                                        id={style.inputAddChoice}
                                                        type="text" placeholder='insert content'
                                                        onChange={(e) => setaddContenChoice(e.target.value)}
                                                    />
                                                    <div className={style.horizontalLay}>
                                                        <select id={style.selectAddChoice} onChange={(e) => setaddCorrectChoice(e.target.value)}>
                                                                <option value={false}>Wrong</option>
                                                                <option value={true}>Correct</option>
                                                        </select>
                                                            {
                                                                addContenChoice && (
                                                                    <FaCirclePlus
                                                                        size={30}
                                                                        color='#186F65'
                                                                        cursor={'pointer'}
                                                                        title='add choice'
                                                                        onClick={handleAddChoices}
                                                                    />
                                                                )
                                                            }
                                                                    
                            
                                                    </div>
                                                </div>
                                            )
                                        }
                                        
                                        {
                                            currentChoices.map((choice, index) => (
                                                    <div className={edittingLetter === choice.letter ? style.cardActiveChoice : style.cardChoice} key={index}>
                                                        <span id={style.boxLetter}>{choice.letter}</span>
                                                        <p>{choice.content.match(/[a-zA-Z0-9]/g).length > 4 ? choice.content.substring(0, 4)+'...' : choice.content}</p>
                                                        <div className={style.horizontalLay}>
                                                            {
                                                                choice.correct ? (
                                                                    <span id={style.boxCorrect}>Correct</span>
                                                                ) : (
                                                                    <span id={style.boxWrong}>Wrong</span>
                                                                )
                                                            }
                                                            {
                                                                enable && (
                                                                    <FiEdit
                                                                    id={style.editLayout}
                                                                    onClick={() => {
                                                                        setEdittingLetter(choice.letter)
                                                                        setEnable(false)
                                                                    }}
                                                                    />
                                                                )
                                                            }
                                                            <AiOutlineDelete 
                                                                id={style.deleteLayout} 
                                                                onClick={() => handleDeleteChoice(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className={style.rightChoicesContainer} style={{ flex: enable ? '0px': '60%', padding: enable ? '0px' : '2% 0% 2% 0%'}}>
                                    {
                                        !enable && (
                                            <ContentChoicesEdit
                                                choicesSet={choicesSet}
                                                currentChoices={currentChoices}
                                                edittingLetter={edittingLetter}
                                                handleEditedChoices={handleEditedChoices}
                                                disableButton={disableButton}
                                                notify={notify}
                                            />
                                        ) 
                                    }
                                    
                                </div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between border-top border-solid border-1 border-color-gray pt-2'>
                                <div className='d-flex gap-1 align-items-center'>
                                    <p id={style.questionLabel2}>Points:</p>
                                    <input 
                                        type="number"
                                        min='0'
                                        id={style.inputPoints} 
                                        value={updatedPoints}
                                        onChange={(e) => setupdatedPoints(e.target.value)}
                                    />
                                </div>
                                <div className='d-flex align-items-center gap-1' style={{ marginLeft: '20%'}}>
                                    <p id={style.questionLabel2}>Required: </p>
                                    <select id={style.select} value={updatedrequired} onChange={(e) => setupdatedrequired(e.target.value)}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                            
                            </div>
                            <div className='mt-2 d-flex justify-content-end align-items-center position-relative'>
                                {
                                    selectedQuestion[0].imageID !== 'none' && (
                                        <div className={style.imgDiv}>
                                            <img src={imageDisplay ? URL.createObjectURL(imageDisplay[0]) : sample } alt="" width={20} height={20} id={style.miniViewImg}/>
                                            <button id={style.btnChangeImg} onClick={handleOpenChangeImage}>Change Image</button>
                                        </div>
                                    )
                                }
                                <button className={style.btnSaveChanges} onClick={(event) => handleSaveChange(event)}>Save Changes</button>
                            </div>
                        </div>
                        </div>
                    )
                }

                {
                    isShowEditor === true && selectedQuestion[0].questionType === 'fill' && (
                        <div className={style.cardQuestionEdit}>
                        <div className={style.bgCard}>
                            <div className='col-3'>
                                <div className={style.quesTypeCard}>
                                    <p id={style.quizTypeLabel}>Question type:</p>
                                    <div className={style.rectangle}>Fill in the blank</div>
                                </div>
                            </div>  
                            <div className='d-flex flex-column col-8 align-items-end justify-content-center'>
                                <div className={style.quesTypeCard}>
                                    <p id={style.quizTypeLabel}>Question number:</p>
                                    <div className={style.rectangle}>
                                        <select className={style.select} onChange={(e) => setupdatedQuestionNumber(e.target.value)}>
                                            {
                                                questionSet.map((question, index) => (
                                                    <option
                                                        selected={question.questionNumber === selectedQuestion[0].questionNumber ? true : false}
                                                        value={question.questionNumber}
                                                        key={index}>Question no.{question.questionNumber}
                                                    </option> 
                                                ))
                                            }
                                            
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.changeByType}>
                            <div className={style.fromQuestion}>
                                <h2 id={style.questionLabel}>Question</h2>
                                <div className={style.layoutDisplay}>
                                    {
                                        fillLayout
                                            .filter((fill) => fill.fillLayoutID === selectedQuestion[0].fillLayoutID)
                                            .map((fill, index) => (
                                                fill.fillType === 'text' && (<p key={index}>{fill.fillContent}</p>) || 
                                                fill.fillType === 'blank' && (<input  key={index} type="text" value={fill.fillContent}/>)
                                        ))
                                    }
                                
                                </div>
                            </div>
                            <div className={style.fromQuestion}>
                               <div className='d-flex mt-2 gap-2'>
                                    <div className={style.leftCons} style={{ flex: enableFill ? '100%' : '50%'}}>
                                        <div className={style.containers}>
                                            <h2>Layout List</h2>
                                            <button id={style.btnAddLayout} onClick={() => setShowAddLayout(!showAddLayout)}>{showAddLayout ? 'Back' : 'Add'}</button>
                                          
                                                    <div className={style.listItems}>
                                                        {
                                                            showAddLayout && (
                                                                <div className={style.cardConsFillAdd}>
                                                                    <input type="text" placeholder='insert content' id={style.inputAddFill} onChange={(e) => setaddContentFill(e.target.value)}/>
                                                                    <div className={style.horizontalLay}>
                                                                        <select id={style.selectAddChoice} onChange={(e) => setaddTypeFill(e.target.value)}>
                                                                                <option value='text'>Text</option>
                                                                                <option value='blank'>Blank</option>
                                                                        </select>
                                                                            {
                                                                                addContentFill && (
                                                                                    <FaCirclePlus
                                                                                        size={30}
                                                                                        color='#186F65'
                                                                                        cursor={'pointer'}
                                                                                        title='add Layout'
                                                                                        onClick={handleAddLayout}
                                                                                    />
                                                                                )
                                                                            }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                        {
                                                            fillLayout
                                                            .filter((fill) => fill.fillLayoutID === selectedQuestion[0].fillLayoutID)
                                                            .map((fill, index) => (
                                                                fill.fillType === 'text' && (
                                                                    <div className={fill.fillPosition === edittingPosition ? style.cardConsActive : style.cardCons} key={index}>
                                                                        <p>{fill.fillContent.match(/[a-zA-Z0-9]/g).length > 7 ? fill.fillContent.substring(0, 7)+'...' : fill.fillContent}</p>
                                                                        <div className={style.horizontalLay}>
                                                                                <span>text</span>
                                                                                {
                                                                                    enableFill && (
                                                                                        <FiEdit
                                                                                            id={style.editLayout}
                                                                                            onClick={() => {
                                                                                                setedittingPosition(fill.fillPosition)
                                                                                                setEnableFill(false)
                                                                                            }}
                                                                                        />
                                                                                    )
                                                                                }
                                                                                    
                                                                                    <AiOutlineDelete 
                                                                                        id={style.deleteLayout} 
                                                                                        onClick={() => handleDeleteLayout(index)}
                                                                                    />
                                                                        </div>
                                                                    </div>
                                                                ) || 
                                                                fill.fillType === 'blank' && (
                                                                    <div className={fill.fillPosition === edittingPosition ? style.cardConsActive : style.cardCons} key={index}>
                                                                        <p>{fill.fillContent.match(/[a-zA-Z0-9]/g).length > 7 ? fill.fillContent.substring(0, 7)+'...' : fill.fillContent}</p>
                                                                        <div className={style.horizontalLay}>
                                                                            <span>blank</span>
                                                                            {
                                                                                enableFill && (
                                                                                    <FiEdit
                                                                                        id={style.editLayout}
                                                                                        onClick={() => {
                                                                                            setedittingPosition(fill.fillPosition)
                                                                                            setEnableFill(false)
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                                <AiOutlineDelete 
                                                                                        id={style.deleteLayout} 
                                                                                        onClick={() => handleDeleteLayout(index)}
                                                                                />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            ))
                                                        }
        
                                                    </div>
                                          

                                        </div>
                                    </div>
                                    <div className={style.rightCons} style={{ flex: enableFill ? '0px' : '50%'}}>
                                        {
                                            !enableFill && (
                                                <ContentLayoutEdit
                                                    edittingPosition={edittingPosition}
                                                    fillLayout={fillLayout}
                                                    selectedQuestion={selectedQuestion[0]}
                                                    setfillLayout={setfillLayout}
                                                    disableButtonFill={disableButtonFill}
                                                />
                                            )
                                        }
                                        
                                    </div>
                               </div>
                                
                            </div>
                            <div className='d-flex align-items-center p-1'>
                                <div className='d-flex gap-1 align-items-center'>
                                    <p id={style.questionLabel2}>Points:</p>
                                    <input 
                                        type="number"
                                        min='0'
                                        id={style.inputPoints} 
                                        value={updatedPoints}
                                        onChange={(e) => setupdatedPoints(e.target.value)}
                                    />
                                </div>
                                <div className='d-flex align-items-center gap-1' style={{ marginLeft: '20%'}}>
                                    <p id={style.questionLabel2}>Required</p>
                                    <select id={style.select} value={updatedrequired} onChange={(e) => setupdatedrequired(e.target.value)}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                                <div className='d-flex align-items-center gap-1' style={{ marginLeft: '5%'}}>
                                    <p id={style.questionLabel2}>KeySensitive</p>
                                    <select id={style.select} value={updatedKeySensitive} onChange={(e) => setupdatedKeySensitive(e.target.value)}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                            </div>
                            <div className='mt-2 d-flex justify-content-end align-items-center position-relative'>
                                {
                                    selectedQuestion[0].imageID !== 'none' && (
                                        <div className={style.imgDiv}>
                                            <img src={imageDisplay ? URL.createObjectURL(imageDisplay[0]) : sample } alt="" width={20} height={20} id={style.miniViewImg}/>
                                            <button id={style.btnChangeImg} onClick={handleOpenChangeImage}>Change Image</button>
                                        </div>
                                    )
                                }
                                <button className={style.btnSaveChanges} onClick={(event) => handleSaveChange(event)}>Save Changes</button>
                            </div>
                        </div>
                        </div>
                    )
                }

                {
                    isShowEditor === true && selectedQuestion[0].questionType === 'True Or False' && (
                        <div className={style.cardQuestionEdit}>
                            <div className={style.bgCard}>
                                <div className='col-3'>
                                    <div className={style.quesTypeCard}>
                                        <p id={style.quizTypeLabel}>Question type:</p>
                                        <div className={style.rectangle}>{selectedQuestion[0].questionType}</div>
                                    </div>
                                </div>  
                                <div className='d-flex flex-column col-8 align-items-end justify-content-center'>
                                    <div className={style.quesTypeCard}>
                                        <p id={style.quizTypeLabel}>Question number:</p>
                                        <div className={style.rectangle}>
                                            <select className={style.select} onChange={(e) => setupdatedQuestionNumber(e.target.value)}>
                                                {
                                                    questionSet.map((question, index) => (
                                                        <option
                                                            selected={question.questionNumber === selectedQuestion[0].questionNumber ? true : false}
                                                            value={question.questionNumber}
                                                            key={index}>Question no.{question.questionNumber}
                                                        </option> 
                                                    ))
                                                }
                                                
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.changeByType}>
                                <div className={style.fromQuestion}>
                                    <h2 id={style.questionLabel}>Question</h2>
                                    <input 
                                        id={style.inputQuestion}
                                        type="text"
                                        value={updatedquestionContent}
                                        onChange={(e) => setupdatedquestionContent(e.target.value)}
                                    />
                                </div>
                                <div className={style.fromQuestion}>
                                    <h2 id={style.questionLabel}>Answer</h2>
                                    <div className='d-flex gap-5 align-items-center justify-content-center mt-2 mb-5'>
                                        <button className={ updatedquestionAnswerText === true ? style.btnTORFActive : style.btnTORF } onClick={() => setupdatedquestionAnswerText(true)}>True</button>
                                        <button className={ updatedquestionAnswerText === false ? style.btnTORFActive : style.btnTORF} onClick={() => setupdatedquestionAnswerText(false)}>False</button>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center p-1 justify-content-between'>
                                    <div className='d-flex gap-1 align-items-center'>
                                        <p id={style.questionLabel2}>Points:</p>
                                        <input 
                                            type="number"
                                            min='0'
                                            id={style.inputPoints} 
                                            value={updatedPoints}
                                            onChange={(e) => setupdatedPoints(e.target.value)}
                                        />
                                    </div>
                                    <div className='d-flex align-items-center gap-1' style={{ marginLeft: '20%'}}>
                                        <p id={style.questionLabel2}>Required: </p>
                                        <select id={style.select} value={updatedrequired} onChange={(e) => setupdatedrequired(e.target.value)}>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='mt-2 d-flex justify-content-end align-items-center position-relative'>
                                    {
                                        selectedQuestion[0].imageID !== 'none' && (
                                            <div className={style.imgDiv}>
                                                <img src={imageDisplay ? URL.createObjectURL(imageDisplay[0]) : sample } alt="" width={20} height={20} id={style.miniViewImg}/>
                                                <button id={style.btnChangeImg} onClick={handleOpenChangeImage}>Change Image</button>
                                            </div>
                                        )
                                    }
                                    <button className={style.btnSaveChanges} onClick={(event) => handleSaveChange(event)}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                    <div className={style.miniDash}>
                        <div className={style.cardDASH}>
                            <p>Total <br/> Questions</p>
                            <div id={style.circleBg}>
                                {questionSet.map((question) => question).length}
                            </div>
                        </div>
                        <div className={style.rightDash}>
                            <div className='d-flex col-3 flex-column align-items-center'>
                                <p>Text Quiz</p>
                                <h1 id={style.h1Dash}>{questionSet.filter((question) => question.questionType === 'text').length}</h1>
                            </div>
                            <div className='d-flex col-3 flex-column align-items-center'>
                                <p>Choices Quiz</p>
                                <h1 id={style.h1Dash}>{questionSet.filter((question) => question.questionType === 'choices').length}</h1>
                            </div>
                            <div className='d-flex col-3 flex-column align-items-center'>
                                <p>Fill in the blank</p>
                                <h1 id={style.h1Dash}>{questionSet.filter((question) => question.questionType === 'fill').length}</h1>
                            </div>
                            <div className='d-flex col-3 flex-column align-items-center'>
                                <p>True Or False</p>
                                <h1 id={style.h1Dash}>{questionSet.filter((question) => question.questionType === 'True Or False').length}</h1>
                            </div>
                            
                        </div>
                    </div>
                    <div className='d-flex justify-content-end mt-2'>
                        <button id={style.btnSaveEdit} onClick={handleFinalEdittedQuestions}>save</button>
                    </div>
                    
                </div>
            <div className={style.menuTop}>
                <MdPreview id={style.icon} size={30} cursor={'pointer'} title='Preview' onClick={() => previewShow('preview')}/>
                <BiExit  id={style.icon} size={30} cursor={'pointer'} title='Exit' onClick={exitTrapNotif}/>
            </div>
            
        </div>
    </div>
  )
}

export default ListPreviewQuiz