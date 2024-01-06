import React, { useEffect, useState } from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import mammoth from 'mammoth';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');


const ActivityPage = () => {

  const [roomID, setroomID] = useState(null)
  const [message, setMessage] = useState()
  const [arrayMessage, setArrayMessage] = useState(['apple', 'mango'])
  const account = JSON.parse(localStorage.getItem('user'))

  useEffect(()=> {
    
    socket.on('testingReceived', (data) => {
      setArrayMessage((old) => [...old, data])
      alert(updated)
    })

    socket.on('receiveMessage', (dataObj) => {
      setmessageList((prevMessage) => [...prevMessage, dataObj])
      alert(dataObj)
    })

    socket.on('testingJoined', (name) => {
      alert(name+' has successfully joined room')
    })
  },[])

  const handleSend = (e) => {
    e.preventDefault()
    socket.emit('testingMessage', roomID, message)
  }

  const handleJoin = () => {
    socket.emit('testingJoin', roomID, account.firstname)
    console.log(account.firstname)
  }
  
  return (
    <div>
        <h1>Room ID</h1>
        <input type="text" onChange={(e) => setroomID(e.target.value)}/>
        {roomID && <button onClick={handleJoin}>Join</button> }
        <form action="" onSubmit={handleSend}>
        <h1>MESSAGE</h1>
        <input type="text" onChange={(e) => setMessage(e.target.value)}/>
        <button type='submit'>Send</button>
      </form>
      {
        arrayMessage && (

            arrayMessage.map((mess) => (
              <p>{mess}</p>
            ))
        )
      }
    </div>
  );
};


export default ActivityPage