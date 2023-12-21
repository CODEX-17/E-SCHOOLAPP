import React, { useEffect, useState } from 'react'
import style from './ChatPage.module.css'
import sample from '../assets/sample.jpg'
import { MdCircle } from "react-icons/md"
import { FaCirclePlus } from "react-icons/fa6"
import { VscSend } from "react-icons/vsc"
import { IoSend } from "react-icons/io5";
import io from 'socket.io-client'



const ChatPage = () => {

  const socket = io.connect('http://localhost:5000')
  const [message, setmessage] = useState('')
  const [received, setreceived] = useState([])

  useEffect(() => {
    socket.emit('hello', 'world');
    socket.on('friend', (msg) => {
      let message = received
      message.push(msg)
      setreceived(message)
      console.log(message)

      

    })
  },[received, message])

  socket.on('message', (msg) => {
    let message = received
    message.push(msg)
    setreceived(message)
  })

  

  const handleSubmit = (e) => {
      e.preventDefault()
      socket.emit('test', message);
      socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) })
      socket.emit('friend', message);
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.leftBar}>
            <h2>Chat</h2>
            <div className={style.chatList}>
                <div className={style.card}>
                  <img src={sample} className={style.circle} alt="pic" />
                  <div className={style.vertical}>
                    <h2>Rumar Pamparo</h2>
                    <p>You:<i> Lorem ipsum dolor sit amet.</i></p>
                  </div>
                  <MdCircle color='yellowgreen' id={style.activeLight}/>
                </div>
                <div className={style.card}>
                  <img src={sample} className={style.circle} alt="pic" />
                  <div className={style.vertical}>
                    <h2>Rumar Pamparo</h2>
                    <p>You:<i> Lorem ipsum dolor sit amet.</i></p>
                  </div>
                  <MdCircle color='yellowgreen' id={style.activeLight}/>
                </div>
                
            </div>
        </div>
        <div className={style.rightBar}>
          <div className={style.header}>
            <img src={sample} alt="dsd" id={style.headerPic}/>
            <div className={style.vertical}>
              <h2>Rumar Pamparo</h2>
              <p>Active now <MdCircle color='yellowgreen' id={style.activeLightHeader}/></p>
            </div>
          </div>
          <div className={style.body}>
            <div className={style.messageScreenContainer}>
              <div className={style.messageScreen}>
                  {
                    received.map((mes, index) => (
                      <div className={style.receiverChatDiv} key={index}>
                        <div className={style.bubbleChatContainer}>
                          <p>9:00AM</p>
                          <div className={style.senderbubbles}>{mes}</div>
                        </div>
                      </div>
                    ))
                  }
                  
                  <div className={style.ownChatDiv}>
                    <div className={style.bubbleChatContainer}>
                      <p>9:00AM</p>
                      <div className={style.bubbles}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia, expedita.</div>
                    </div>
                  </div>

                  
                  
                  
                  
                </div>
            </div>
            <form action="" onSubmit={handleSubmit} className={style.formControl}>
              <div className={style.botPanel}>
                  <FaCirclePlus id={style.plusSign} />
                  <textarea required value={message} onChange={(e) => setmessage(e.target.value)}>
                  </textarea>
                  <IoSend id={style.sendSign} type='submit' onClick={handleSubmit}/>
              </div>
              </form>
          </div>
          
        </div>
      </div>
      
    </div>
  )
}

export default ChatPage