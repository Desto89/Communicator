import React, { useState, useEffect, useRef } from 'react'
import './Chatroom.css'
import { database } from '../firebase'
import { ref, update, onValue} from "firebase/database";
import { animateScroll } from "react-scroll";

function Chatroom(props) {

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState(null)
    const enableScroll = useRef()

    function scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: "messagesScroll",
          duration: 100
        });
    }

    useEffect(() => {
        if (props.user) {
            const readData = ref(database, 'communicator/' + props.id + '/' + props.user + '/' + 'messages');
            onValue(readData, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                const array = Object.values(data)
                setMessages(array)
        }
        });
        } else {
            const readData = ref(database, 'communicator/chatroom/');
            onValue(readData, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                const array = Object.values(data)
                setMessages(array)
        }
        });
        }
        
    }, [])
    
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function sendMessage() {
        if (props.user) {
            update(ref(database, 'communicator/' + props.id + '/' + props.user + '/' + 'messages' + '/' + Date.now()), {
                username: props.id,
                photo: props.photo,
                text : input,
              },
              );
              update(ref(database, 'communicator/' + props.user + '/' + props.id + '/' + 'messages' + '/' + Date.now()), {
                username: props.id,
                photo: props.photo,
                text : input,
              },
              );
            setInput('')
        } else {
            update(ref(database, 'communicator/chatroom/' + Date.now()), {
                username: props.id,
                photo: props.photo,
                text : input,
                date : Date.now(),
              },
              );
            setInput('')
        }
        
    }

    function send(key) {
        if (key.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <div className='chatroomGlobal'>
           <div id='messagesScroll' className='messages'>
               {messages !== null &&
                messages.map((message) => {
                    if (message.username === props.id) {
                        return (
                            <div key={message.date} className='message myMessage'>
                                <div className='messageContent myMessageContent'>
                                    <p>{message.text}</p>
                                    <img src={message.photo} alt='' />
                                </div>
                            </div>
                            )
                    } else {
                        return (
                            <div key={message.date} className='message otherMessage'>
                                <div className='messageContent otherMessageContent'>
                                    <img src={message.photo} alt='' />
                                    <p>{message.text}</p>
                                </div>
                            </div>
                            )
                    }
                    
                })
               }
           </div>
           <div className='inputField'>
               <input onChange={(e)=>{setInput(e.target.value)}} onKeyDown={send} type='text' placeholder='Send message...' value={input} />
               <button onClick={() => {sendMessage()}}>➤</button>
           </div>
        </div>
    )
}

export default Chatroom
