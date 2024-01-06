import React, { useEffect, useState, useRef } from 'react'
import style from './ChatPage.module.css'
import sample from '../assets/sample.jpg'
import { MdCircle } from "react-icons/md"
import { FaCirclePlus } from "react-icons/fa6"
import { VscSend } from "react-icons/vsc"
import { IoSend } from "react-icons/io5";
import io from 'socket.io-client'
import { useMemberStore } from '../stores/useMemberStore'
import { useMessageStore } from '../stores/useMessageStore'
import { LuArrowBigDownDash } from "react-icons/lu";
const socket = io.connect('http://localhost:5000')


const ChatPage = () => {

  const [messageList, setmessageList] = useState([])
  const message = JSON.parse(localStorage.getItem('messages')) || null
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const friends = JSON.parse(localStorage.getItem('friends')) || null
  const [friendsList, setfriendsList] = useState([])
  const accounts = JSON.parse(localStorage.getItem('accounts')) || null
  const images = JSON.parse(localStorage.getItem('images')) || null
  const [selectedFriend, setselectedFriend] = useState(null)
  const [sendedMessage, setsendedMessage] = useState(null)
  const [currentReceiverName, setcurrentReceiverName] = useState(null)
  const [currentRoomID, setcurrentRoomID] = useState(null)
  const { saveMessages } = useMessageStore()
  const [uniqueID, setuniqueID] = useState(null)
  const chatContainerRef = useRef(null);
  const [onlineList, setonlineList] = useState([])

  let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
  let currentDate = new Date().toDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          weekday: 'short'
  })

  useEffect(() => {
    filterCurrentFriends(currentUser.acctID)
    socket.on('onlinePerson', (list) => {
      setonlineList(list)
      alert(list)
    })

    socket.on('isTyping', (data) => {
      if (data) {
        console.log('typing...')
      }else {
        console.log('nott...')
      }
      
    })
    
  },[])

  useEffect(() => {
    
    socket.on('joinedRoom', (message) => {
      alert(message)
    })

    socket.on('mess', (dataObj) => {
      setmessageList((old) => [...old, dataObj])
      alert(dataObj)
    })

  },[]) 


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = '9999999999';
    }

  };

  const filterCurrentMessage = (receiver, name) => {
    const conversations = message.filter(
        (message) =>
            (message.messageSender === currentUser.acctID &&
                message.messageReceiver === receiver) ||
            (message.messageReceiver === currentUser.acctID &&
                message.messageSender === receiver)
    );

    setcurrentReceiverName(name);
    setselectedFriend(receiver);

    if (conversations.length > 0 && conversations[0].roomID) {
        setcurrentRoomID(conversations[0].roomID);
        socket.emit('joinRoom', conversations[0].roomID, currentUser.firstname);
    } else {
        const result = generateUniqueId();
        setuniqueID(result);
        setcurrentRoomID(result);
        socket.emit('joinRoom', result, currentUser.firstname);
    }

    setmessageList((prevMessage) => [...prevMessage, ...conversations]);
    scrollToBottom()
  };

  // const filterCurrentMessage = (receiver, name) => {
  //     const conversations = 
  //       message.filter((message) => 
  //         (message.messageSender === currentUser.acctID && message.messageReceiver === receiver)
  //          || 
  //         (message.messageReceiver === currentUser.acctID && message.messageSender === receiver)
  //       )

  //     setcurrentReceiverName(name)
  //     setmessageList(conversations)
  //     setselectedFriend(receiver)
  //     if (conversations[0].roomID) {
  //       setcurrentRoomID(conversations[0].roomID)
  //       socket.emit('joinRoom', conversations[0].roomID)
  //     }else {
  //       const result = generateUniqueId()
  //       setuniqueID(result)
  //       setcurrentRoomID(result)
  //       socket.emit('joinRoom', result)
  //     }

      
  // }

  const filterCurrentFriends = (acctID) => {
    if (friends) {
      const currentFriends = friends.filter((friend) => friend.acctID === acctID)
      setfriendsList(currentFriends)
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
    return result
  }

  const generateImages = (friendAcctID) => {
    const userImages = images.filter((img) => img.imageID === friendAcctID).map((img) => img.data)
      if (userImages) {
        const image = userImages
        const url = 'http://localhost:5000/'
        return url+image
      }

      return sample
  }

  const handleSubmit = (e) => {
      e.preventDefault()
      scrollToBottom()
      const dataObj = {
        roomID: currentRoomID,
        messageContent:sendedMessage,
        messageSender: currentUser.acctID,
        messageReceiver: selectedFriend,
        date: currentDate,
        time: currentTime,
      }

      socket.emit('sendMessage', currentRoomID, dataObj);
      saveMessages(dataObj)
      // socket.emit('message', sendedMessage);
      // socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) })
      // socket.emit('friend', message);
  }

  const handleWrintingMessage = (data) => {
    if (data) {
      socket.emit('typing', currentRoomID, true)
    }
    setsendedMessage(data)
    scrollToBottom()
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.leftBar}>
            <h2>Chat</h2>
            <div className={style.chatList}>
              {
                friendsList.map((friend, index) => (
                  <div className={selectedFriend === friend.friendAcctID ? style.cardActive : style.card } key={index} onClick={() => filterCurrentMessage(friend.friendAcctID, friend.fullname)}>
                    <img src={generateImages(friend.friendAcctID)} className={style.circle} alt="pic" />
                    <div className={style.vertical}>
                      <h2>{friend.fullname}</h2>
                      <p>You:<i> Lorem ipsum dolor sit amet.</i></p>
                    </div>
                    <MdCircle color='yellowgreen' id={style.activeLight}/>
                  </div>
                ))
              }
                
               
                
            </div>
        </div>
        <div className={style.rightBar}>
         {
          selectedFriend ? (
              <>
              <div className={style.header}>
                <img src={generateImages(selectedFriend)} alt="dsd" id={style.headerPic}/>
                <div className={style.vertical}>
                  <h2>{currentReceiverName ? currentReceiverName :'Name'}</h2>
                  <p>Active now <MdCircle color='yellowgreen' id={style.activeLightHeader}/></p>
                </div>
                <LuArrowBigDownDash
                    id={style.scrollDown}
                    onClick={() =>scrollToBottom()}
                    title='Scroll Down'
                />
              </div>
              <div className={style.body}>
                <div className={style.messageScreenContainer} >
                  {
                    messageList.length > 0 ? (
                      <div className={style.messageScreen} ref={chatContainerRef}>
                      {
                        messageList.map((message, index) => (

                          message.messageSender === currentUser.acctID ? (
                            <div className={style.ownChatDiv} key={index}>
                              <div className={style.bubbleChatContainer}>
                                <p>{message.time}</p>
                                <div className={style.bubbles}>{message.messageContent}</div>
                              </div>
                            </div>
                          ) : (
                            <div className={style.receiverChatDiv} key={index}>
                              <div className={style.bubbleChatContainer}>
                                <p>{message.time}</p>
                                <div className={style.senderbubbles}>{message.messageContent}</div>
                              </div>
                            </div>
                          )

                        )) 
                      }
                      
                    </div>

                    ) : (
                      <div className='h-100 d-flex align-items-center justify-content-center'>
                        <p>No Conversations</p>
                      </div>
                    )
                  }
                  
                </div>
                <form action="" onSubmit={handleSubmit} className={style.formControl}>
                  <div className={style.botPanel}>
                      <FaCirclePlus id={style.plusSign} />
                      <textarea required value={sendedMessage} onChange={(e) => handleWrintingMessage(e.target.value)}>
                      </textarea>
                      <IoSend id={style.sendSign} type='submit' onClick={handleSubmit}/>
                  </div>
                  </form>
              </div>
              </>
          ) : (
            <div className='h-100 d-flex align-items-center justify-content-center'>
              <p>Select Conversation.</p>
            </div>
          )

         }
          
        </div>
      </div>
      
    </div>
  )
}

export default ChatPage