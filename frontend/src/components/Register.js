import "./register.css"
import axios from 'axios'
import {useRef, useState} from "react";

import RoomIcon from '@material-ui/icons/Room'
import Cancel from '@material-ui/icons/Cancel'

export default function Register({setShowRegister}) {

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value        

        }
      

        try {
            // REACT_APP_REGISTER
            const url = 'http://localhost:8080/register'
            // const url = process.env.REACT_APP_REGISTER
            await axios.post(url, newUser)
            setSuccess(true)
            setError(false)


        } catch(err) {
            console.log(err)
            setError(true)
            setSuccess(false)
        }
    }
   return ( <div className="registerContainer">
        <div className="logo">
        <RoomIcon />
             Elliott Arnold's Interactive Map        
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type='text' placeholder="username" ref={nameRef} ></input>
            <input type='email' placeholder="email" ref={emailRef}></input>
            <input type='password' placeholder="password" ref={passwordRef}></input>
            <button className='registerButton'> Register</button>
            {success &&  <span className="success">Successful! You can login now.</span>}
            {error &&  <span className="failure">Something went wrong.</span>}
           
        </form>
        <Cancel onClick={() => setShowRegister(false)} className="registerCancel" />

    </div> )
}