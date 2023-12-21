import React, { useEffect, useState } from 'react'
import style from './ClassHome.module.css'
import { ToastContainer, toast } from 'react-toastify';
import { Howl, Howler } from "howler";
import notifSound from '../assets/sound/notif.mp3';
import erroSound from '../assets/sound/error.mp3'; 
import sample from '../assets/sample.jpg'
import { GoHeart } from "react-icons/go"
import { GoHeartFill } from "react-icons/go"
import { AiOutlineLike, AiFillFilePpt, AiOutlineDelete } from "react-icons/ai"
import { AiFillLike } from "react-icons/ai"
import { FaFileImage, FaRegImages } from "react-icons/fa6"
import { MdSend, MdOutlineAttachment } from "react-icons/md"
import { FaFilePdf, FaFileWord, FaFileExcel } from "react-icons/fa"
import { FiDownload } from "react-icons/fi"
import FilesClass from '../components/FilesClass'
import { RiSendPlaneFill } from "react-icons/ri"
import { BiExit } from "react-icons/bi"
import { usePostStore } from '../stores/usePostStore';
import { useImageStore } from '../stores/useImageStore';
import { useAccountStore } from '../stores/useAccountsStore'
import ClassMembers from '../components/ClassMembers';
import { useNavigateStore } from '../stores/useNavigateStore';
import axios from 'axios'
import ClassQuizSetup from './ClassQuizSetup';
import ClassAssignment from './ClassAssignment';
import { GiNotebook } from "react-icons/gi";

const ClassHome = ({ currentSubjectName, currentImageClass, currentClassCode, currentMemberID, backToHomePage }) => {

 
 const [memberID, setmemberID] = useState(currentMemberID)
 const [heartReact, setheartReact] = useState(false)
 const [uniqueId, setuniqueId] = useState('')
 const [likeReact, setlikeReact] = useState(false)
 const [showComment, setShowComment] = useState(false)
 const [choose, setChoose] = useState('home')
 const [postContent, setPostContent] = useState('')
 const [postSet, setpostSet] =useState([])
 const [name, setName] = useState('Rumar C. Pamparo')
 const [post, setPost] = useState([])
 const [fileID, setfileID] = useState('none')
 const [imageID, setimageID] = useState('none')
 const [replyID, setreplyID] = useState('none')
 const [heartCount, setheart] = useState(0)
 const [likeCount, setlike] = useState(0)
 const [subjectName, setsubjectName] = useState(currentSubjectName)
 const classCode = currentClassCode
 const [imageFile, setimageFile] = useState(null)
 const [file, setFile] = useState()
 const [userAccount, setUserAccount] = useState(JSON.parse(localStorage.getItem('user')))
 const [imageUser, setImageUser] = useState()
 const quiz = JSON.parse(localStorage.getItem('quiz'))

 const [currentPost, setCurrentPost] = useState()
 const [postType, setPostType] = useState('')
 const [quizObj, setQuizObj] = useState('')
 
 const { uploadPost, deletePost, getPost } = usePostStore()
 const { uploadImage, getImages, images } = useImageStore()
 const { getAccountById, currentAccount} = useAccountStore()
 const { updateRouteChoose } = useNavigateStore()

 
 const [showChangeImageModal, setshowChangeImageModal] = useState(false)

 const notif = new Howl({ src: [notifSound]})
 const errSound = new Howl({ src: [erroSound]})

 let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
 let date = new Date().toDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    weekday: 'short' 
 })

useEffect(()=>{
    generateUniqueId()
    currentPostClass()
    getImages()
},[])

// setInterval(() => {
//     getPost()
//     currentPostClass()
// }, 1000);

const navigateClass = (choose, type, obj) => {
    setQuizObj(obj['quiz'])
    setChoose(choose)
    setPostType(type) 
}

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



const currentPostClass = () => {
    const allPost = JSON.parse(localStorage.getItem('post'))
    const currentPost = allPost.filter((posts) => posts.classCode === currentClassCode)
    localStorage.setItem('currentpost', JSON.stringify(currentPost))
    setCurrentPost(currentPost)
}

const handleDeletePost = (target) => {
    const filter = postSet.filter((posts, index) => index === target)
    const id =filter[0].id
    deletePost(id)
    getPost()
}

 
const handleGetImage = (e) => {
    e.preventDefault()
    const file = e.target.files
    setFile(file)
}

const handleUploadImage = () => {
    generateUniqueId()
    if (uniqueId) {
        const image = {
            file: file[0],
            imageID: uniqueId,
        }
        setimageFile(image)
        uploadImage(image)
        setshowChangeImageModal(false)
    }
}

const handlePost = () => {
    
    if (postContent) {
        generateUniqueId()
        const image = imageFile ? (imageFile.imageID) : ('none')

        let updatedPost = {
            acctID: userAccount.acctID,
            name: generateFullname(),
            timePosted: time,
            datePosted: date,
            postContent,
            replyID: uniqueId,
            imageID: image,
            fileID,
            heartCount,
            likeCount,
            classCode: currentClassCode,
            subjectName,
            postType: 'normal',
            quizID: 'none',
            duration: 'none',
        }
        setPost(updatedPost)
        uploadPost(updatedPost)
        getPost()
        getImages()
        let updatedData = currentPost
        updatedData.push(updatedPost)
        setCurrentPost(updatedData)
        localStorage.setItem('currentPost', JSON.stringify(updatedData))

        reset()
        const message = 'Successfully posted.'
        notify(message, 'success')
    }else {
        const message = 'Please insert Content'
        notify(message, 'err')
    }

    getPost()
    currentPostClass()
    
}

const handlePostAssignment = (content, quizID, duration) => {
    generateUniqueId()
    let updatedPost = {
        acctID: userAccount.acctID,
        name: generateFullname(),
        timePosted: time,
        datePosted: date,
        postContent: content,
        replyID: uniqueId,
        imageID: 'none',
        fileID: 'none',
        heartCount,
        likeCount,
        classCode: currentClassCode,
        subjectName,
        postType: 'assignment',
        quizID: quizID,
        duration,
    }
    console.log(updatedPost)
    uploadPost(updatedPost)
}

const reset = () => {
    setPostContent('')
    setimageFile(null)
}

const generateFullname = () => {
    if (userAccount) {
        const fullname = userAccount.firstname + ' ' + userAccount.middlename.charAt(0) + '. ' + userAccount.lastname
        return fullname
    }else {
        console.log('accountUser none')
    }
    
}

const generatePic = (imageID) => {
    getImages()
    const id = imageID
    const url = 'http://localhost:5000/'
    const allImages = JSON.parse(localStorage.getItem('images'))
    const filter = allImages.filter((img) => img.imageID === id).map((img) => img.data)
    if (url+filter[0]) {
        return url+filter[0]
    }
}
 
const imageUserPost = (id) => {
    const accounts = JSON.parse(localStorage.getItem('accounts'))
    const imagesList = JSON.parse(localStorage.getItem('images'))
    const accountImageID = accounts.filter((account) => account.acctID === id).map((account) => account.imageID)
    const filterImage = imagesList.filter((img) => img.imageID === accountImageID[0]).map((img) => img.data)
    const url = 'http://localhost:5000/'
    return url+filterImage[0]
}

const handleExit = () => {
    backToHomePage('classPage')
}

const generateQuizName = (data) => {
    const filter = quiz.filter((q) => q.quizID === quizID)
    console.log(data)
    // quizName = filter[0].quizTitle
    //return quizName
}

  return (
    <div className={style.container}>
        <ToastContainer/>
        {
                showChangeImageModal && (
                    <div className={style.changeImageContainer}>
                        <div className={style.headerImagePic}>
                            <div className='d-flex gap-2 align-items-center'>
                                <p>Change Image</p>
                            </div>
                             
                            <BiExit size={20} title='closed' cursor={'pointer'} onClick={() => setshowChangeImageModal(false)}/>
                        </div>
                        <img src={file? URL.createObjectURL(file[0]) : sample } alt="image" id={style.imgChangePic}/>
                        <input type="file" accept='image/*' id={style.imgUpload} onChange={handleGetImage}/>
                        <button className={style.btnChangeImage} onClick={handleUploadImage}>Upload</button>
                    </div>
                )
        }

        <div className={style.leftContent}>
            <img src={currentImageClass} alt="pic" id={style.imgClass} />
            <h2>{subjectName}</h2>
            <p>{currentClassCode}</p>
            <button className={choose === 'home' ? style.btnNavActive : style.btnNav} onClick={() => setChoose('home')}>Home</button>
            <button className={choose === 'files' ? style.btnNavActive : style.btnNav} onClick={() => setChoose('files')}>Files</button>
            <button className={choose === 'quizSetup' ? style.btnNavActive : style.btnNav} onClick={() => setChoose('quizSetup')}>Create Quiz</button>
            <button className={choose === 'assignment' ? style.btnNavActive : style.btnNav} onClick={() => setChoose('assignment')}>Assignment</button>
            <button className={choose === 'members' ? style.btnNavActive : style.btnNav} onClick={() => setChoose('members')}>Class Members</button>
            <button className={choose === 'exit' ? style.btnNavActive : style.btnNav} onClick={() => handleExit()}>Exit</button>
        </div>
        <div className={style.rightContent}>
            
            {
                choose === 'home' && (
                    <>
                        <div className={style.card}>
                            <div className='d-flex flex-column gap-2'>
                                <div className='d-flex align-items-center gap-1'>
                                    <img src={imageUserPost(userAccount.imageID)} alt="profile" id={style.imgDp}/>
                                    <h2 id={style.name}>{generateFullname()}</h2>
                                    <div className={style.menuUpper}>
                                        <MdOutlineAttachment className={style.upperIcons}/>
                                        <FaRegImages className={style.upperIcons} onClick={() => setshowChangeImageModal(true)}/>
                                        <button id={style.btnPost} onClick={handlePost}>Post <RiSendPlaneFill/></button>
                                    </div>
                                </div>
                                <div className='d-flex gap-2 '>
                                    {
                                        imageFile ? (<img src={URL.createObjectURL(imageFile.file)} alt="image" id={style.imgPostPreview}/>) : ''
                                    }
                                    <textarea className={style.textarea} value={postContent} placeholder="What's on your mind?" onChange={(e) => setPostContent(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className={style.listPostContainer}>
                        {
                            currentPost ?
                            (
                                currentPost.slice().reverse().map((post, index) => (
                                    <div className={style.card} key={index}>
                                        <div className={style.top}>
                                            <img src={imageUserPost(post.acctID)} alt="profile" id={style.imgDp}/>
                                            <h2>{post.name}</h2>
                                            <p>{post.timePosted +' ('+post.datePosted+')'}</p>
                                            <AiOutlineDelete id={style.deleteBtn} title='delete' onClick={() => handleDeletePost(index)}/>
                                        </div>
                                        <div className={style.body}>
                                            <p>{post.postContent}</p>
                                            {
                                                post.imageID !== 'none' && (<img src={generatePic(post.imageID)} alt="photo" id={style.imgSend}/>)
                                            }
                                            {
                                                post.fileID !== 'none'  && (
                                                    <>
                                                        <div id={style.filePdf}>
                                                            <FaFilePdf size={20} color='#F45050'/>
                                                            <p>Module_unit_one.pdf</p>
                                                            <button className={style.btnView}>View</button>
                                                            <FiDownload size={20} color='#3E3F40'/>
                                                        </div>
                                                        <div id={style.filePdf}>
                                                            <FaFileWord size={20} color='#00337C'/>
                                                            <p>Module_unit_one.docx</p>
                                                            <button className={style.btnView}>View</button>
                                                            <FiDownload size={20} color='#3E3F40'/>
                                                        </div>
                                                        <div id={style.filePdf}>
                                                            <AiFillFilePpt size={23} color='#F45050'/>
                                                            <p>Module_unit_one.ppt</p>
                                                            <button className={style.btnView}>View</button>
                                                            <FiDownload size={20} color='#3E3F40'/>
                                                        </div>
                                                        <div id={style.filePdf}>
                                                            <FaFileExcel size={20} color='#17594A'/>
                                                            <p>Module_unit_one.pdf</p>
                                                            <button className={style.btnView}>View</button>
                                                            <FiDownload size={20} color='#3E3F40'/>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            {
                                                post.quizID !== 'none'  && (
                                                        <div id={style.quizBox}>
                                                            <div className='d-flex gap-2'>
                                                                <GiNotebook size={20} color='#186F65'/>
                                                                <p>{quiz.filter((q) => q.quizID === post.quizID).map((q)=> q.quizTitle)}</p>
                                                            </div>
                                                            <button className={style.btnView}>Take</button>
                                                        </div>
                                                )
                                            }

                                        </div>
                                        
                                        <div className={style.footer}>
                                            { 
                                                heartReact ? 
                                                    <GoHeartFill 
                                                        onClick={() => setheartReact(!heartReact)}
                                                        cursor={'pointer'}
                                                        size={20}
                                                        color='#F45050'
                                                    /> : 
                                                    <GoHeart 
                                                        onClick={() => setheartReact(!heartReact)}
                                                        cursor={'pointer'}
                                                        size={20}
                                                        color='#3E3F40'
                                                    />
                                            }
                        
                                            {
                                                likeReact ? 
                                                    <AiFillLike
                                                        onClick={() => setlikeReact(!likeReact)}
                                                        cursor={'pointer'}
                                                        size={20}
                                                        color='#3081D0'
                                                    /> :
                                                    <AiOutlineLike
                                                        onClick={() => setlikeReact(!likeReact)}
                                                        cursor={'pointer'}
                                                        size={20}
                                                        color='#3E3F40'
                                                    />
                                            }
                        
                                            {
                                                showComment ? (
                                                    <>
                                                        <input type="text" />
                                                        <FaFileImage/>
                                                        <MdSend 
                                                            color='#099AED'
                                                            cursor={'pointer'}
                                                        />
                                                    </>
                                                ) : (
                                                    <p onClick={() => setShowComment(true)}>Reply</p>
                                                )
                                            }
                                            
                                            
                                            
                                        </div>
                                    </div>))
                             ) : (
                                JSON.parse(localStorage.getItem('post')) ? 
                                (
                                    JSON.parse(localStorage.getItem('post')).slice().reverse().map((post, index) => (
                                        <div className={style.card} key={index}>
                                            <div className={style.top}>
                                                <img src={imageUserPost(post.acctID)} alt="profile" id={style.imgDp}/>
                                                <h2>{post.name}</h2>
                                                <p>{post.timePosted +' ('+post.datePosted+')'}</p>
                                                <AiOutlineDelete id={style.deleteBtn} title='delete' onClick={() => handleDeletePost(index)}/>
                                            </div>
                                            <div className={style.body}>
                                                <p>{post.postContent}</p>
                                                {
                                                    post.imageID !== 'none' && (<img src={generatePic(post.imageID)} alt="photo" id={style.imgSend}/>)
                                                }
                                                {
                                                    post.fileID !== 'none'  && (
                                                        <>
                                                            <div id={style.filePdf}>
                                                                <FaFilePdf size={20} color='#F45050'/>
                                                                <p>Module_unit_one.pdf</p>
                                                                <button className={style.btnView}>View</button>
                                                                <FiDownload size={20} color='#3E3F40'/>
                                                            </div>
                                                            <div id={style.filePdf}>
                                                                <FaFileWord size={20} color='#00337C'/>
                                                                <p>Module_unit_one.docx</p>
                                                                <button className={style.btnView}>View</button>
                                                                <FiDownload size={20} color='#3E3F40'/>
                                                            </div>
                                                            <div id={style.filePdf}>
                                                                <AiFillFilePpt size={23} color='#F45050'/>
                                                                <p>Module_unit_one.ppt</p>
                                                                <button className={style.btnView}>View</button>
                                                                <FiDownload size={20} color='#3E3F40'/>
                                                            </div>
                                                            <div id={style.filePdf}>
                                                                <FaFileExcel size={20} color='#17594A'/>
                                                                <p>Module_unit_one.pdf</p>
                                                                <button className={style.btnView}>View</button>
                                                                <FiDownload size={20} color='#3E3F40'/>
                                                            </div>
                                                        </>
                                                    )
                                                }

                                            </div>
                                            
                                            <div className={style.footer}>
                                                { 
                                                    heartReact ? 
                                                        <GoHeartFill 
                                                            onClick={() => setheartReact(!heartReact)}
                                                            cursor={'pointer'}
                                                            size={20}
                                                            color='#F45050'
                                                        /> : 
                                                        <GoHeart 
                                                            onClick={() => setheartReact(!heartReact)}
                                                            cursor={'pointer'}
                                                            size={20}
                                                            color='#3E3F40'
                                                        />
                                                }
                            
                                                {
                                                    likeReact ? 
                                                        <AiFillLike
                                                            onClick={() => setlikeReact(!likeReact)}
                                                            cursor={'pointer'}
                                                            size={20}
                                                            color='#3081D0'
                                                        /> :
                                                        <AiOutlineLike
                                                            onClick={() => setlikeReact(!likeReact)}
                                                            cursor={'pointer'}
                                                            size={20}
                                                            color='#3E3F40'
                                                        />
                                                }
                            
                                                {
                                                    showComment ? (
                                                        <>
                                                            <input type="text" />
                                                            <FaFileImage/>
                                                            <MdSend 
                                                                color='#099AED'
                                                                cursor={'pointer'}
                                                            />
                                                        </>
                                                    ) : (
                                                        <p onClick={() => setShowComment(true)}>Reply</p>
                                                    )
                                                }
                                                
                                                
                                                
                                            </div>
                                        </div>))
                                ) : (
                                    'Create a post.'
                                )
                             )
                        }
                            <div className={style.card}>
                                <div className={style.top}>
                                    <img src={sample} alt="profile" id={style.imgDp}/>
                                    <h2>Rumar C. Pamparo</h2>
                                    <p>6:00AM</p>
                                    <AiOutlineDelete id={style.deleteBtn} title='delete'/>
                                </div>
                                <div className={style.body}>
                                    <p>Create a program that sort the array fruits...</p>
                                    <img src={sample} alt="photo" id={style.imgSend}/>
                                    <div id={style.filePdf}>
                                        <FaFilePdf size={20} color='#F45050'/>
                                        <p>Module_unit_one.pdf</p>
                                        <button className={style.btnView}>View</button>
                                        <FiDownload size={20} color='#3E3F40'/>
                                    </div>
                                    <div id={style.filePdf}>
                                        <FaFileWord size={20} color='#00337C'/>
                                        <p>Module_unit_one.docx</p>
                                        <button className={style.btnView}>View</button>
                                        <FiDownload size={20} color='#3E3F40'/>
                                    </div>
                                    <div id={style.filePdf}>
                                        <AiFillFilePpt size={23} color='#F45050'/>
                                        <p>Module_unit_one.ppt</p>
                                        <button className={style.btnView}>View</button>
                                        <FiDownload size={20} color='#3E3F40'/>
                                    </div>
                                    <div id={style.filePdf}>
                                        <FaFileExcel size={20} color='#17594A'/>
                                        <p>Module_unit_one.pdf</p>
                                        <button className={style.btnView}>View</button>
                                        <FiDownload size={20} color='#3E3F40'/>
                                    </div>
                                </div>
                                
                                <div className={style.footer}>
                                    { 
                                        heartReact ? 
                                            <GoHeartFill 
                                                onClick={() => setheartReact(!heartReact)}
                                                cursor={'pointer'}
                                                size={20}
                                                color='#F45050'
                                            /> : 
                                            <GoHeart 
                                                onClick={() => setheartReact(!heartReact)}
                                                cursor={'pointer'}
                                                size={20}
                                                color='#3E3F40'
                                            />
                                    }
                
                                    {
                                        likeReact ? 
                                            <AiFillLike
                                                onClick={() => setlikeReact(!likeReact)}
                                                cursor={'pointer'}
                                                size={20}
                                                color='#3081D0'
                                            /> :
                                            <AiOutlineLike
                                                onClick={() => setlikeReact(!likeReact)}
                                                cursor={'pointer'}
                                                size={20}
                                                color='#3E3F40'
                                            />
                                    }
                
                                    {
                                        showComment ? (
                                            <>
                                                <input type="text" />
                                                <FaFileImage/>
                                                <MdSend 
                                                    color='#099AED'
                                                    cursor={'pointer'}
                                                />
                                            </>
                                        ) : (
                                            <p onClick={() => setShowComment(true)}>Reply</p>
                                        )
                                    }
                                    
                                    
                                    
                                </div>
                            </div>
                        </div>
                    </>
                )
            } 
            { choose === 'files' && <FilesClass/> }
            { choose === 'quizSetup' && <ClassQuizSetup subjectName={subjectName} navigateClass={navigateClass}/> }
            { choose === 'assignment' && <ClassAssignment postType={postType} quizObj={quizObj} handlePostAssignment={handlePostAssignment}/> }
            { choose === 'members' && <ClassMembers memberID={memberID}/> }

        </div>
    </div>
  )             
}

export default ClassHome