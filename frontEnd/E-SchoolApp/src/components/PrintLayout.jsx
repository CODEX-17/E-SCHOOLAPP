import React, { useRef } from 'react'
import style from './PrintLayout.module.css'
import html2pdf from 'html2pdf.js'
import { BiExit } from "react-icons/bi"
import { FiEdit } from 'react-icons/fi'
import { SlPrinter } from "react-icons/sl"
import csu from '../assets/csu.png'
import cics from '../assets/cics.png'
import { TiExport } from "react-icons/ti"

const PrintLayout = ({ previewShow, questionObj, quizTitle, quizInstructions, choices, fillLayoutSet }) => {

    console.log(questionObj)
    console.log('fillLayoutSet:',fillLayoutSet)
    
    const pdfContainerRef = useRef(null)
    const questionSet = questionObj
    const choicesSet = choices
    const fillLayout = fillLayoutSet
    const questionChoices = questionSet.filter((ques) => ques.questionType === 'choices')
    const questionText = questionSet.filter((ques) => ques.questionType === 'text')
    const questionFill = questionSet.filter((ques) => ques.questionType === 'fill')
    const questionTORF = questionSet.filter((ques) => ques.questionType === 'True Or False')

    const handleExportPDF = () => {
        const content = pdfContainerRef.current;

        if (content) {
          const pdfOptions = {
            margin: 10,
            filename: 'exported-document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          };
    
          html2pdf().from(content).set(pdfOptions).save();
        }
      };

  return (
    <div className={style.containerPrint}> 
            <div id={style.menuBtn}>
                <TiExport id={style.btnMenu} size={25} title='Export to PDF' onClick={handleExportPDF}/>
                <FiEdit id={style.btnMenu} size={20} title='Edit' onClick={() => previewShow('previewList')}/>
                <BiExit id={style.btnMenu} size={21} title='Exit' onClick={() => previewShow('generator')}/>
            </div>
        <div className={style.contentPrint}>
            <div ref={pdfContainerRef} className={style.examPrint}>
                <div className={style.header}>
                    <img src={cics} alt="cics" className={style.logo}/>
                    <div className={style.vertical}>
                        <h1>Final Examination</h1>
                        <p>{quizTitle}</p>
                    </div>
                    <img src={csu} alt="cics" className={style.logo}/>
                </div>
                <div className='d-flex justify-content-between mt-5 mb-4'>
                    <div className={style.bio}>
                        <p>Name:_________________</p>
                        <p>Section:_________________</p>
                    </div>
                    <div className={style.bio}>
                        <p>Score:_________________</p>
                        <p>Date:_________________</p>
                    </div>
                </div>
                <div className={style.instructions}>
                    <h1>Instruction</h1>
                    <p style={{ paddingLeft: '5%'}}>{quizInstructions}</p>
                </div>
                {
                    questionChoices.length > 0 && (
                        <div className={style.examMultipleChoice}>
                            <h1><u>Multiple Choice</u></h1>
                            <p><b>DIRECTION:</b> Choose the correct answer and write it on your answer sheet.</p>
                            {
                                questionChoices.map((questions, index) => (
                                    <div className={style.questions} key={index}>
                                        <p>{parseInt(index+1)+'. '+questions.questionContent}</p>
                                        {
                                            choicesSet
                                                .filter((choices) => choices.choicesID === questions.choicesID)
                                                .map((choices, index) => (
                                                    <p className={style.choices} key={index}>{choices.letter+'. '+choices.content}</p>
                                                ))
                                        }

                                    </div>
                                ))
                            }
                            
                        </div>
                    )
                }

                {
                    questionText.length > 0 && (
                        <div className={style.examMultipleChoice}>
                            <h1><u>Enumeration</u></h1>
                            <p><b>DIRECTION:</b> Write TRUE if the answer is true and write FALSE if the answer is False. </p>
                            {
                                questionText.map((questions, index) => (
                                    <div className={style.questions} key={index}>
                                        <p>{'___________'+parseInt(index+1) +'. '+ questions.questionContent}</p>

                                    </div>
                                ))
                            }
                            
                        </div>
                    )
                }

                {
                    questionFill.length > 0 && (
                        <div className={style.examMultipleChoice}>
                            <h1><u>Fill in the blank</u></h1>
                            <p><b>DIRECTION:</b> Write TRUE if the answer is true and write FALSE if the answer is False. </p>
                            <div className={style.questions}>
                                {
                                    questionFill.map((questions, index) => (
                                        <p key={index}>
                                            {parseInt(index+1) + '. '}
                                            {
                                                fillLayout
                                                .filter((fill) => fill.fillLayoutID === questions.fillLayoutID)
                                                .map((fill, index) => (
                                                    fill.fillType === 'blank' && ('___________') ||
                                                    fill.fillType === 'text' && (fill.fillContent)
                                                ))
                                            }
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    questionTORF.length > 0 && (
                        <div className={style.examMultipleChoice}>
                             <h1><u>True Or False</u></h1>
                                <p><b>DIRECTION:</b> Write TRUE if the answer is true and write FALSE if the answer is False. </p>    
                                {
                                    questionTORF.map((questions, index) => (
                                        <div className={style.questions} key={index}>
                                            <p>{'___________'+parseInt(index+1)+'. '+ questions.questionContent}</p>

                                        </div>
                                    ))
                                }
                        </div>
                    )
                }

            </div>
        </div>
    </div>
  ) 
}

export default PrintLayout