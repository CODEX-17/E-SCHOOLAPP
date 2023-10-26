import React, { useEffect, useState } from 'react'
import style from './MultipleQuiz.module.css'
import { FaBell } from "react-icons/fa6";

const MultipleQuiz = () => {

const [selectedValue, setselectedValue] = useState('question');

const [quizSet, setquizSet] = useState([]);

const [quiz, setQuiz] = useState({
    no: 0,
    totalQuestions: 0,
    points: 0,
    layout: [],
})

const [questions, setquestions] = useState({
    no: 0,
    content: '',
    type: 'question',
})

const [blank, setblank] = useState({
    no: 0,
    position: 0,
    points: 0,
    correctAnswer: '',
    result: true,
    type: 'blank',
})

const handleAdd = (event) => {
    event.preventDefault()
    console.log(selectedValue)

    if (selectedValue == 'question') {
        setquizSet((quizSet) => [...quizSet, questions])
        setquestions({...questions, no: questions.no + 1})
      
    }else if (selectedValue == 'blank') {
        setquizSet((quizSet) => [...quizSet, blank])
        setblank({...blank, no: blank.no + 1})
    }

}

  return (
    <div className={style.container}>
        <FaBell/>
        <div style={{border: '2px solid black', width: 'auto', padding: '5px', margin: '50px', display: 'flex'}}>
            {
                quizSet.map((quiz, index)=> (
                    quiz.type === 'question' ? <p key={index}>{quiz.content}</p> : <input id='input' key={index} type='text'/>
                ))
            }
        </div>
        
        <div>
            <form action="">
                <div>
                    {
                        selectedValue === 'question' && 
                            <input type="text" 
                                placeholder="Enter Question" 
                                required onChange={(e) => (
                                    setquestions({...questions, content: e.target.value})
                                    )}
                            />
                    }
                </div>
           
                { //show if the blank is choosen to pop up the blanks
                    selectedValue === 'blank' && <div>
                        <label htmlFor="points">Points:</label>
                        <input type="number" name='points' required onChange={(e) => (
                            setblank({...blank, points: e.target.value})
                        )}/>
                        <label htmlFor="answer">Correct Answer:</label>
                        <input type="text" name='answer' required onChange={(e) => (
                            setblank({...blank, correctAnswer: e.target.value})
                        )}/>
                       
                    </div>
                }
                
                <select value={selectedValue} onChange={(event => setselectedValue(event.target.value))}>
                    <option value="question">Question</option>
                    <option value="blank">Blank</option>
                </select>
                <button onClick={handleAdd}>add</button>
                <p>{
                JSON.stringify(questions.no)+
                JSON.stringify(quizSet)
                }
                </p>
            </form>
        </div>
       
    </div>
  )
}

export default MultipleQuiz