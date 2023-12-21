import React, { useState } from 'react'
import style from './ContentChoicesEdit.module.css'

const ContentChoicesEdit = ({currentChoices, edittingLetter, choicesSet, handleEditedChoices, disableButton, notify}) => {

    const selectedChoice = currentChoices.filter((choice)=> choice.letter === edittingLetter)
    const choicesID = selectedChoice[0]?.choicesID
    const content = selectedChoice[0]?.content
    let letter = edittingLetter
    let correct = selectedChoice[0]?.correct === 'true' || selectedChoice[0]?.correct === true ? 'yes' : 'no'

    const [updatedContent, setupdatedContent] = useState(content)
    const [updatedCorrect, setupdatedCorrect] = useState(correct)
    const [updatedLetter, setupdatedLetter] = useState(edittingLetter)

    const handleSaveUpdatedChoices = () => {

        const convertCorrect = updatedCorrect === 'yes' ? true : false
        let updatedChoices = choicesSet

        for (let i = 0; i < updatedChoices?.length; i++) {
            if (updatedChoices[i].letter === letter) {
                updatedChoices[i].content = updatedContent
                updatedChoices[i].correct = convertCorrect
            }
          }
          
         const correctLetter = updatedChoices.filter((choices) => choices.correct === true).length

          if (correctLetter === 0) {
            const message = 'You must have atleast one correct choice.'
            notify(message, 'err')
          }else {
            handleEditedChoices(updatedChoices)
            disableButton(true)
          }
          
    }

  return (
    <div className={style.rightContainer}>
        <h2>Choices Editor</h2>
        <div className={style.horizontalContainer}>
            <div className={style.prevEditor}>
                <p>Preview</p>
                <div className={style.choicesCardActive}>{updatedContent.match(/[a-zA-Z0-9]/g).length > 10 ?  (updatedLetter+'. '+updatedContent.substring(0, 10)+'...') : (updatedLetter+'. '+updatedContent)}</div>
            </div>
        </div>
        <div className={style.botCon}>
            <p>Content</p>
            <textarea value={updatedContent} onChange={(e) => setupdatedContent(e.target.value)}></textarea>
            <div className='w-100 d-flex justify-content-start align-items-center gap-2 mt-1'>
                <p>Correct</p>
                <select id={style.selectCorrect} value={updatedCorrect} onChange={(e) => setupdatedCorrect(e.target.value)}>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option> 
                </select>
               <button id={style.btnSaveChoiceEditor} onClick={handleSaveUpdatedChoices}>Save</button>
            </div>
            
        </div>
    </div>
  )
}

export default ContentChoicesEdit