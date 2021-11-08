import React from 'react'
import './Chatroom.css'
import { useState } from 'react'
import Messages from './Messages'
import Chatroom from './Chatroom'

function Main(props) {

    const [currentWindow, setCurrentWindow] = useState('messages')

    return (
        <div className='main'>
            <div className='header'>
               <img src={props.photo} alt='' />
               <div className='options'>
                    <button onClick={()=>{setCurrentWindow('messages')}}>Messages</button>
                    <button onClick={()=>{setCurrentWindow('chatroom')}}>Chatroom</button>
                </div>
               <button onClick={() => {props.logout()}}>Logout</button>
           </div>
            {currentWindow === 'messages' && 
                <Messages id={props.id} name={props.name} photo={props.photo} setCurrentWindow={setCurrentWindow}/>
            }
            {currentWindow === 'chatroom' &&
                <Chatroom photo={props.photo} name={props.name} id={props.id}/>
            }
            {currentWindow.length > 10 &&
                <Chatroom photo={props.photo} name={props.name} id={props.id} user={currentWindow}/>
            }
        </div>
    )
}

export default Main
