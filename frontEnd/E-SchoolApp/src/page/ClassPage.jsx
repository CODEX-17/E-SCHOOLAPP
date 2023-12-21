import React, { useEffect, useState } from 'react'
import style from './ClassPage.module.css'
import logo from '../assets/logo.png'
import whiteLogo from '../assets/logo-white.png'
import { useClassStore } from '../stores/useClassStore'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc"
import { useNavigateStore } from '../stores/useNavigateStore'
import { useMemberStore } from '../stores/useMemberStore'
import axios from 'axios'
import ClassHome from './ClassHome'
import excel from '../assets/excel.png'
import { BiExit } from "react-icons/bi";

const ClassPage = () => {

const { addClass, getClass, classes, hideClass } = useClassStore()
const { getMembers } = useMemberStore()
const [isClassListShow, setisClassListShow] = useState(true)
const [isModalShow, setisModalShow] = useState(false)
const [showExcellInputCard, selectExcellInputCard] = useState(false)
const [textButton, settextButton] = useState('Create Class')
const [className, setclassName] = useState() 
const [acctID, setacctID] = useState()
const [classDesc, setclassDesc] = useState()
const [showCreateClass, setshowCreateClass] = useState(false)
const [classesObj, setclassesObj] = useState([])
const [currentImageClass, setcurrentImageClass] = useState('')

const [dropHideList, setdropHideList] = useState(false)
const { updateRouteChoose } = useNavigateStore()
const [showPreview, setshowPreview] = useState('classPage')
const [currentSubjectName, setcurrentSubjectName] = useState()
const [currentClassCode, setcurrentClassCode] = useState()
const [currentMemberID, setcurrentMemberID] = useState()
const [uniqueId, setuniqueId] = useState('')

const [allClasses, setallClasses] = useState(null)
const [membersList, setmembersList] = useState(null)
const [userAccount, setuserAccount] = useState(JSON.parse(localStorage.getItem('user')))
const [userClasses, setuserClasses] = useState(null)

useEffect(() => {
    setallClasses(JSON.parse(localStorage.getItem('classes')))
    setmembersList(JSON.parse(localStorage.getItem('members')))
    getCurrentClass()
},[])

useEffect(() => {
    if(classesObj < 0) {
        isClassListShow(false)
    }
}, [])

  const getCurrentClass = () => {
    const allClasses = JSON.parse(localStorage.getItem('classes'))
    const allMembers = JSON.parse(localStorage.getItem('members'))

    if (allClasses && allMembers) {
        const filter = allMembers.filter((member) => member.acctID === userAccount.acctID)
        let classes = []
        let updated = [] 
        for (let i = 0; i < filter.length; i++) {
            classes.push(allClasses.filter((cls) => cls.membersID === filter[i].membersID))
            updated.push({
                classID: classes[i][0].classID,
                className: classes[i][0].className,
                classDesc: classes[i][0].classDesc,
                classCode: classes[i][0].classCode,
                membersID: classes[i][0].membersID,
                imageID: classes[i][0].imageID,
                acctID: filter[i].acctID,
                hidden: filter[i].hidden,
            })
        }
        localStorage.setItem('currentClasses', JSON.stringify(updated))
        setuserClasses(updated)
    }
  }

const handleHideClass = (acctID, membersID, state) => {
    axios.put('http://localhost:5000/hideClass', { acctID, membersID, state })
      .then((res) => {
        getMembers()
        getCurrentClass()
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    getMembers()
    getCurrentClass()
}

const dropDownHiddenClass = () => {
    setdropHideList(!dropHideList)
}

const handleCreateClass = () => {
    setisClassListShow(false)

    if (textButton === 'Create Class') {
        console.log(classesObj)
        settextButton('Back')
        setshowCreateClass(true)
    }else {
        settextButton('Create Class')
        setshowCreateClass(false)
        setisClassListShow(true)
    }
}

const CreateClass = () => {
    setisModalShow(!isModalShow)    
}

const handleSubmit = (e) => { 
    e.preventDefault()
    addClass(className, classDesc, acctID)
    setisModalShow(false)
    setshowCreateClass(false)
    setisClassListShow(true)
}

const handleOpenClass = (subjectName, classCode, membersID, imageID) => {
    setcurrentMemberID(membersID)
    setcurrentClassCode(classCode)
    setcurrentSubjectName(subjectName)
    setshowPreview('classHome')
    const image = generatePic(imageID)
    setcurrentImageClass(image)
}

const backToHomePage = (choose) => {
    setshowPreview(choose)
}

const generatePic = (id) => {
    const allimages = JSON.parse(localStorage.getItem('images'))
    const filter = allimages.filter((images) => images.imageID === id).map((img) => img.data)
    const url = 'http://localhost:5000/'
    return url+filter[0]
}

  return (
    <>
        {
            showPreview === 'classHome' && (
                <ClassHome 
                   currentSubjectName={currentSubjectName}
                   currentClassCode={currentClassCode}
                   currentMemberID={currentMemberID}
                   backToHomePage={backToHomePage}
                   currentImageClass={currentImageClass}
                />
            )
        }

        {
            showPreview === 'classPage' && (
                <div className={style.container}>
                    {
                        isModalShow && (
                            <div className={style.modalContainer}>
                                <form action="" onSubmit={handleSubmit}>
                                    <div className={style.modalContent}>
                                        <h1>Create you Class</h1>
                                        <p>Teachers have ownership of the class, while students actively engage as members. Within each class, you have the ability to generate quizzes, document student feedback, and share announcements.</p>
                                        <label>Name:</label>
                                        <input type="text" onChange={(e) => setclassName(e.target.value)} required/>
                                        <br />
                                        <label>Description(optional):</label>
                                        <textarea id={style.desInput} type="text" onChange={(e) => setclassDesc(e.target.value)}></textarea>
                                        <div className={style.horMenu}>
                                            <button id={style.btnCancel} onClick={CreateClass}>Cancel</button>
                                            <button type='submit'>Next</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {
                        showCreateClass && (
                            <div className={style.content}>
                                <h1 id={style.mainTitle}>Join or Create a Class</h1>
                                <div className={style.horizontal}>
                                    <div className={style.card}>
                                        <img src={logo} width={144} alt="logo" />
                                        <h2>Create Class</h2>
                                        <button onClick={CreateClass}>Create</button>
                                    </div>
                                    {
                                        !showExcellInputCard ? (
                                            <div className={style.card}>
                                                <img src={excel} width={200} alt="logo" />
                                                <h2>Import Excel</h2>
                                                <button onClick={() => selectExcellInputCard(true)}>Import</button>
                                            </div>
                                        ) : (
                                            <div className={style.card} style={{ backgroundColor: '#D0E7D2'}}>
                                                <BiExit size={20} id={style.iconExit} onClick={() => selectExcellInputCard(false)}/>
                                                <input type="file" id={style.importExcelFile} accept='.xlsx'/>
                                                <button onClick={CreateClass} style={{ backgroundColor: '#099AED'}}>Upload</button>
                                            </div>
                                        )
                                    }
                                    
                                    <div className={style.card}>
                                        <img src={whiteLogo} width={144} alt="Whitelogo" />
                                        <h2 id={style.joinText}>Join in Class with ClassCode</h2>
                                        <input type="text" />
                                        <button>Create</button>
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
                            isClassListShow && (
                                <div className={style.listContainer}>
                                    <div className={style.classVisible}>
                                        <h2 id={style.classListLabel}>Class List</h2>
                                        <div className={style.horizontalList}>
                                                {
                                                    userClasses? (
                                                        userClasses.filter((classes) => classes.hidden === 'false').map((classes, index) => (   
                                                            <div className={style.classCard} key={index}>
                                                                <AiFillEyeInvisible size={20} className={style.btnVisible} title='Hide class' onClick={() => handleHideClass(classes.acctID, classes.membersID, 'true')}/>
                                                                <div className={style.mainPoint} onClick={() => handleOpenClass(classes.className, classes.classCode, classes.membersID, classes.imageID)}>
                                                                    <img src={generatePic(classes.imageID)} alt='class photo' id={style.imageContainer}/>
                                                                    <h1>{classes.className}</h1>
                                                                    <p>{classes.classDesc}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        JSON.parse(localStorage.getItem('currentClasses'))? (
                                                            JSON.parse(localStorage.getItem('currentClasses')).filter((classes) => classes.hidden === 'false').map((classes, index) => (   
                                                                <div className={style.classCard} key={index}>
                                                                    <AiFillEyeInvisible size={20} className={style.btnVisible} title='Hide class' onClick={() => handleHideClass(classes.acctID, classes.membersID, 'true')}/>
                                                                    <div className={style.mainPoint} onClick={() => handleOpenClass(classes.className, classes.classCode, classes.membersID, classes.imageID)}>
                                                                        <img src={generatePic(classes.imageID)} alt='class photo' id={style.imageContainer}/>
                                                                        <h1>{classes.className}</h1>
                                                                        <p>{classes.classDesc}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className={style.reminder}>
                                                                <h2>ADD YOUR CLASS.</h2>
                                                            </div>
                                                        )
                                                    )
                                                    
                                                }
                                        </div>
                                    </div>

                                    <div className={style.classHidden}>
                                        <h2 id={style.classListLabel}>Hidden Class &nbsp;
                                            {
                                                dropHideList ? (
                                                    <VscTriangleUp size={15} title='Show hidden class' cursor={'pointer'} onClick={dropDownHiddenClass}/>
                                    
                                                ) : (
                                                    <VscTriangleDown size={15} title='Show hidden class' cursor={'pointer'} onClick={dropDownHiddenClass}/>
                                    
                                                )
                                            }
                                            </h2>
                                            {
                                                dropHideList && (
                                                    <div className={style.horizontalList}>
                                                        {
                                                            userClasses.filter((classes) => classes.hidden === 'true').map((classes, index) => (
                                                                <div className={style.classCard} key={index}>
                                                                    <AiFillEye size={20} className={style.btnVisible} title='Unhide class' onClick={() => handleHideClass(classes.acctID, classes.membersID, 'false')}/>
                                                                    <img src={generatePic(classes.imageID)} alt='class photo' id={style.imageContainer}/>
                                                                    <h1>{classes.className}</h1>
                                                                    <p>{classes.classDesc}</p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                            
                                    </div>
                                    
                                </div>
                            )  
                        
                        }

                </div>
            )
        }

    </>
  )
}

export default ClassPage