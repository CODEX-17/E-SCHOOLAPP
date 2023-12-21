import React, {useState} from 'react'
import style from './ContentLayoutEdit.module.css'

const ContentLayoutEdit = ({ edittingPosition, setfillLayout, fillLayout, selectedQuestion, disableButtonFill}) => {

        let position = edittingPosition
        const selectedLayout = position ? fillLayout?.filter((fill) => fill.fillPosition === position) : fillLayout[0]
        const fillContent = selectedLayout[0]?.fillContent
        const fillPosition = selectedLayout[0]?.fillPosition
        const fillLayoutID = selectedLayout[0]?.fillLayoutID
        const fillType = selectedLayout[0]?.fillType

        console.log('position: ', position)
        console.log('selectedLayout: ', selectedLayout)
        console.log('fillContent: ', fillContent)
        console.log('fillPosition: ', fillPosition)
        console.log('fillLayoutID: ', fillLayoutID)
        console.log('fillType: ', fillType)
   
        const [updatedContent, setupdatedContent] = useState(fillContent)
        const [updatedPosition, setupdatedPosition] = useState(null)


        const handleUpdateLayoutEdited = () => {
          console.log('selectedLayoutLoob: ', selectedLayout)
          const targetPosition = parseInt(fillPosition)
          const desiredPosition = updatedPosition === null ? parseInt(fillPosition)-1 : parseInt(updatedPosition)-1
          const targetData = fillLayout?.filter((fill, index) => fill.fillPosition === targetPosition)
          const restData = fillLayout?.filter((fill, index) => fill.fillPosition !== targetPosition)
          let updatedFillLayout = []

          console.log('targetPosition: ', targetPosition)
          console.log('desiredPosition: ', desiredPosition)
          console.log('updatedContent: ', updatedContent)
          console.log('fillContent: ', fillContent)

          for (let i = 0, int = 0; i < fillLayout?.length; i++) {
            if (i === desiredPosition) {
              console.log('hit')
              updatedFillLayout.push({
                  fillPosition: desiredPosition+1,
                  fillContent: !updatedContent ? fillContent : updatedContent,
                  fillLayoutID,
                  fillType,
              })
            }else {
              console.log('hit1')
              updatedFillLayout.push({
                  fillPosition: i+1,
                  fillContent: restData[int].fillContent,
                  fillLayoutID,
                  fillType: restData[int].fillType,
                })
                int++
            }
          }

          setfillLayout(updatedFillLayout)
          setupdatedContent('')
          disableButtonFill(true)
          console.log('updatedFillLayout: ', updatedFillLayout)
          console.log('content: ', updatedContent)
          console.log('desiredPosition: ', updatedPosition)
          console.log('oldSelection: ', selectedLayout)
          console.log('oldDData: ', fillLayout)
          
          
      }

  return (
    <div className={style.containers}>
        <h2>Content Editor</h2>
        {
          fillPosition && (
            <button
            id={style.updateEdittingLayout}
            onClick={handleUpdateLayoutEdited}>Update</button>
          )
        }
        
        <div className={style.topLayout}>
            <p>Position</p>
            <select onChange={(e) => setupdatedPosition(e.target.value)}>
                { 
                    fillLayout
                        .filter((fill) => fill.fillLayoutID === selectedQuestion.fillLayoutID)
                        .map((fill, index) => (
                            <option key={index} value={fill.fillPosition} selected={fill.fillPosition === fillPosition? true : false}>{'position : '+fill.fillPosition}</option>
                        ))
                } 
            </select>
        </div>
        <div className={style.botLayout}>
            <p>Content</p>
            <textarea placeholder={!updatedContent ? fillContent : ''} value={updatedContent && updatedContent} onChange={(e) => setupdatedContent(e.target.value)}></textarea>
        </div>
    </div>
  )
}

export default ContentLayoutEdit