import "./login.css"
import axios from 'axios'
import {useRef, useState} from "react";

import RoomIcon from '@material-ui/icons/Room'
import Cancel from '@material-ui/icons/Cancel'

export default function Login({setShowLogin,myStorage, setCurrentUser}) {

    const nameRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value        

        }
      

        try {
            
            const url = 'http://localhost:8080/login'
            const res = await axios.post(url, user)
            myStorage.setItem('username', res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)


        } catch(err) {
            console.log(err)
            setError(true)
           
        }
    }
   return ( <div className="loginContainer">
        <div className="logo">
        <RoomIcon />
             Elliott Arnold's Interactive Map        
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type='text' placeholder="username" ref={nameRef} ></input>
        
            <input type='password' placeholder="password" ref={passwordRef}></input>
            <button className='registerButton'> Login</button>
            {error &&  <span className="failure">Something went wrong.</span>}
           
        </form>
        <Cancel onClick={() => setShowLogin(false)} className="loginCancel" />

    </div> )
}