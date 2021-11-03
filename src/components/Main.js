import React, { useState, useEffect, useRef } from 'react'
import './Main.css'
import { database } from '../firebase'
import { ref, update, onValue} from "firebase/database";
import { animateScroll } from "react-scroll";

function Main(props) {

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
        const readData = ref(database, 'messages/');
        onValue(readData, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            const array = Object.values(data)
            setMessages(array)
        }
    });
    }, [])
    
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function sendMessage() {
        update(ref(database, 'messages/' + Date.now()), {
            username: props.id,
            photo: props.photo,
            text : input,
            date : Date.now(),
          },
          );
        setInput('')
    }

    function send(key) {
        if (key.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <div className='main'>
           <div className='header'>
               <img src={props.photo} alt='' />
               <h3>{props.name}</h3>
               <button onClick={() => {props.logout()}}>Logout</button>
           </div>
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

export default Main
