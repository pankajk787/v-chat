import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';

import { IoMdSend } from 'react-icons/io';
import './Chat.css'

const Chat = ({socket, username, room}) => {
    const [currentMsg, setCurrentMsg] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async ()=>{
        if(currentMsg!==''){
            const msgData = {
                room: room,
                author: username,
                msg: currentMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            // When the user sends the message for the other users in the room
            await socket.emit('send_message', msgData)
            setCurrentMsg("") // For clearing the msg input field after the message is sent

            // after sending the message, append the message data to the message list, so that it can also be displayed
            setMessageList((prevMsgList)=> [...prevMsgList, msgData])
        }
    }

    useEffect(()=>{
        // the data sent by other user in the room to be recieved here
        socket.on("recieve_message",(data)=>{
            // append the recieved message data to the message list
            setMessageList((prevMsgList)=> [...prevMsgList, data])
        })
    }, [socket]) // whenever any of the other user in the room sends the message, there is a change in the socket object(which was sent as props from App component)
                // Then this useEffect code will run

  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {messageList.map((msg_item, index)=>{
                return <div className='message' key={index} id={msg_item.author === username ? "you" : "other"}>
                    <div>
                        <div className='message-content'>
                            <p>{msg_item.msg}</p>
                        </div>
                        <div className='message-meta'>
                            <p id='time'>{msg_item.time}</p>
                            <p id='author'>{msg_item.author}</p>
                        </div>
                    </div>
                </div>
            })}
            </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input type="text" placeholder="Type a message..." 
            value={currentMsg}
            onChange = {(e)=> setCurrentMsg(e.target.value)}
            onKeyDown = {(e)=>{ e.key === 'Enter' && sendMessage()}}
            />
            <button onClick={sendMessage}><IoMdSend style = {{fontSize: "1.2rem"}}/></button>
        </div>
    </div>
  )
}

export default Chat;
