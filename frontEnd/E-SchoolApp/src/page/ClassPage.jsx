import React, { useEffect, useState } from 'react'
import style from './ClassPage.module.css'
import logo from '../assets/logo.png'
import whiteLogo from '../assets/logo-white.png'
import { useClassStore } from '../stores/useClassStore'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc"
import axios from 'axios'


const ClassPage = () => {

const { addClass, getClass, classes, hideClass } = useClassStore()
const [isClassListShow, setisClassListShow] = useState(true)
const [isModalShow, setisModalShow] = useState(false)
const [textButton, settextButton] = useState('Create Class')
const [className, setclassName] = useState()
const [classDesc, setclassDesc] = useState()
const [showCreateClass, setshowCreateClass] = useState(false)
const [classesObj, setclassesObj] = useState([])
const [dropHideList, setdropHideList] = useState(false)
const [isShowReminders, setisShowReminders] = useState(false)

 useEffect(() => {
    fetchData();
    if(classesObj < 0) {
        isShowReminders(true)
        isClassListShow(false)
    }
  }, [classes, classesObj]);

const fetchData = () => {
    axios.get('http://localhost:5000/getClass')
      .then((response) => {
        setclassesObj(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
};


const handleHideClass = (id, state) => {

    axios.put('http://localhost:5000/hideClass/'+id, { state })
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        console.error(err);
      });

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
    addClass(className, classDesc)
    setisModalShow(false)
    setshowCreateClass(false)
    setisClassListShow(true)
}


  return (
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
                        
                                        classesObj.filter((classes) => classes.hidden === 'false').map((classes, index) => (
                                            <div className={style.classCard} key={index}>
                                                <AiFillEyeInvisible size={20} className={style.btnVisible} title='Hide class' onClick={() => handleHideClass(classes.id, 'true')}/>
                                                <div id={style.imageContainer}>image</div>
                                                <h1>{classes.className}</h1>
                                                <p>{classes.classDesc}</p>
                                            </div>
                                        ))
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
                        
                                                classesObj.filter((classes) => classes.hidden === 'true').map((classes, index) => (
                                                    <div className={style.classCard} key={index}>
                                                        <AiFillEye size={20} className={style.btnVisible} title='Unhide class' onClick={() => handleHideClass(classes.id, 'false')}/>
                                                        <div id={style.imageContainer}>image</div>
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

            {
                isShowReminders && (
                    <div className={style.reminder}>
                        <h2>ADD YOUR CLASS.</h2>
                    </div>
                )
                
            }

    </div>
  )
}

export default ClassPage