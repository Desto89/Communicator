import React from 'react'
import './LoginPage.css'

function LoginPage(props) {
    return (
        <div className='loginPage'>
            <button onClick={() => {props.login()}}>Sign in with Google</button>
        </div>
    )
}
export default LoginPage
