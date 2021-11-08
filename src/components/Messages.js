import React from 'react'
import './Messages.css'
import { useState } from 'react'
import { database } from '../firebase'
import { ref, update, onValue} from "firebase/database";
import { useEffect } from 'react';

function Messages(props) {

    const [search, setSearch] = useState('')
    const [searchedPeople, setSearchedPeople] = useState(null)
    const [myFriends, setMyFriends] = useState([])

    function searchDB() {
        const readData = ref(database, 'communicator/users/');
        onValue(readData, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            const array = Object.values(data)
            setSearchedPeople(array)
        }
        });
    }

    useEffect(() => {
        const readData = ref(database, 'communicator/' + props.id);
        onValue(readData, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            const array = Object.values(data)
            setMyFriends(array)
        }
        });
    }, [])

    function addFriend(id, username, photo) {
        update(ref(database, 'communicator/' + props.id + '/' + id), {
            id: id,
            username: username,
            photo: photo
          },
          );
          update(ref(database, 'communicator/' + id + '/' + props.id), {
            id: props.id,
            username: props.name,
            photo: props.photo
          },
          );
          props.setCurrentWindow(id)
          
    }


    return (
        <div className='messages'>
            <div className='inputField'>
                <input onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search for friends...' value={search} />
                {searchedPeople === null &&
                    <button onClick={()=>{searchDB()}}>🔎︎</button>
                }
                {searchedPeople !== null &&
                    <button style={{backgroundColor: 'red'}} onClick={()=>{setSearchedPeople(null)}}>X</button>
                }
            </div>
            <div className='friends'>
                {searchedPeople === null &&
                    myFriends.map((friend) => {
                        return (
                            <div onClick={()=>{props.setCurrentWindow(friend.id)}} key={friend.id} className='friend'>
                                <img alt='' src={friend.photo} />
                                <h3>{friend.username}</h3>
                            </div>
                        )  
                    })
                }
                {searchedPeople !== null &&
                    searchedPeople.map((person) => {
                        if (person.username.toLowerCase().includes(search.toLowerCase()) && person.username !== props.name) {
                        return (
                            <div onClick={()=>{addFriend(person.id, person.username, person.photo)}} key={person.id} className='friend'>
                                <img alt='' src={person.photo} />
                                <h3>{person.username}</h3>
                            </div>
                        )
                    }
                    })
                }
            </div>
        </div>
    )
}

export default Messages
