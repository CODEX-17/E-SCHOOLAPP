import React, { useState } from 'react'
import style from './QuizGenerator.module.css'
import { IoRadioButtonOnSharp } from "react-icons/io5";
import { PiTextTFill } from "react-icons/pi";
import { LuTextCursorInput } from "react-icons/lu";



const QuizGenerator = () => {
  const [isShowChoices, setisShowChoices] = useState(false)
  const [quizChoice, setquizChoice] = useState()
  

  const toastStyle = {
  
  }

  const handleChoices = () => {
    setisShowChoices(true)
  }

  const handleRemoveChoices = () => {
    setisShowChoices(false)
    setquizChoice('')
  }


 const handleSubmit = () => {
    setisToast(true)
 }

  return (
    <div id={style.container} className='w-50 p-5 m-5 h-100'>
        <h1 className={style.title}>Generate Quiz</h1>
        <div id={style.box} className="w-100 rounded p-3">
          <h1 className={style.quiztitle}>Quiz Title:</h1>
          <input type="text" className='form-control'/>
          <br />
          <h1 className={style.quiztitle}>Quiz Description:</h1>
          <input type="text" className='form-control'/>
        </div>
        
        <div id={style.content} className="content w-100 mt-2 p-2 rounded">
          <button className={style.btnAddQuestion} onClick={handleChoices}>Add Question</button>
          
            {
              isShowChoices && (
                <div className={style.contentBox}>
                  <div className={style.choicesBox} onClick={() => setquizChoice('text')}>
                    <PiTextTFill/>
                     <h1 className='fs-6'>Text Quiz</h1>
                  </div>
                  <div className={style.choicesBox} onClick={() => setquizChoice('choices')}>
                    <IoRadioButtonOnSharp/>
                     <h1 className='fs-6'>Multiple Choice</h1>
                  </div>
                  <div className={style.choicesBox} onClick={() => setquizChoice('fillBlank')}>
                      <LuTextCursorInput/>
                     <h1 className='fs-6'>Fill in the Blank</h1>
                  </div>
                  <button className={style.btnRemove} onClick={handleRemoveChoices}>X</button>
                </div>
              )
            }
            { 
              quizChoice === 'text' && (
                <div className={style.formTextQuiz}>
                  <form id={style.form} onSubmit={handleSubmit}>
                    <button className={style.removeFormQuiz} onClick={() => setquizChoice('')}>X</button>
                    <h1 className={style.title}>Text Quiz</h1>
                    <p className={style.questionNum}>Question number: 1</p>
                    <input  className='form-control' type="text" placeholder='Enter question' required/>
                    <h2 className={style.correctAnswerTitle}>Correct answer:</h2>
                    <input  className='form-control' type="text" placeholder='Enter answer' required/>
                    <div className='w-100 d-flex mt-4 mb-2 align-items-center gap-2'>
                      <h1 className='text-light m-0'>Points:</h1>
                      <input className={style.inputPoints} type="number" required />
                      <input type="checkbox" />
                      <h1 className='text-light m-0'>Required Answer</h1>
                      <button id="liveToastBtn" className={style.btnAdd} type='submit' title='Save The Question'>Add</button>
                    </div>
                  </form>
                </div>
              )  
            }
            { 
              quizChoice === 'choices' && (
                <div className={style.formTextQuiz}>
                  text choices
                </div> 
              )  
            }
            



           
        </div>
    </div>
  )
}

export default QuizGenerator