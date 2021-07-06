
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import Star from '@material-ui/icons/Star'
import axios from 'axios'
import Register from './components/Register'
import Login from './components/Login'

import {format} from 'timeago.js'
import './App.css';



function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [title, setNewTitle] = useState(null)
  const [desc, setNewDesc] = useState(null)
  const [rating, setNewRating] = useState(0)


  useEffect(() => {
    //REACT_APP_ALLPINS
    const url = "http://localhost:8080/api/allPins"
    
    // const url = process.env.REACT_APP_ALLPINS
    const getPins = async () => {
      try {
        const res =  await axios.get(url)
        setPins(res.data)
      } catch(err) {
          console.log(err)
      }
    }
    getPins()
  }, [])


 
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 29.97916667,
    longitude: 31.13416667,
    zoom: 4
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({
      width: "100vw",
      height: "100vh",
      latitude: lat,
      longitude: long,
    zoom: 4
    })

  }

  const handleTitle = (value) => {
    setNewTitle(value)
  }

  const handleDesc = (value) => {
    setNewDesc(value)
  }

  const handleAddClick = (e) => {
    const [long, lat] =  e.lngLat
    setNewPlace({lat:lat,long:long})

  }

  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPin = {
        username: currentUser,
        title: title,
        desc: desc,
        rating: rating,
        lat: newPlace.lat,
        long: newPlace.long
    }

    try {
      // REACT_APP_NEW_PIN
      // const url = "http://localhost:8080/api/pins"
      const url = process.env.REACT_APP_NEW_PIN
      const res = await axios.post(url, newPin)
      console.log(res.data)
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch(err) {
      console.log(err)

    }
  }

  return (

    <ReactMapGL 
    {...viewport}
    const mapboxApiAccessToken = "pk.eyJ1Ijoic2kzbXNoYWR5IiwiYSI6ImNrcXF6d2ljYTJjcDcyeHF0YzR0ZmVibW8ifQ.xNRYf1ybY6LHYXriebMQJg"
    mapStyle="mapbox://styles/si3mshady/ckqryr9vc320q17jm0783x0as"
    onViewportChange={nextViewport => setViewport(nextViewport)} 
    onDblClick={(e) => handleAddClick(e)}
    transitionDuration="100"
    >
   
    {pins.map(p => (
<>
<Marker latitude={p.lat} longitude={p.long} 
offsetLeft={-viewport.zoom * 6} offsetTop={-viewport.zoom * 3}  >    

<RoomIcon
onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
style={{fontSize:viewport.zoom * 6, color: p.username === currentUser? "red": "blue", cursor:'pointer'}}

></RoomIcon>

</Marker>

{p._id === currentPlaceId && (
 <Popup
 latitude={p.lat}
 longitude={p.long}
 onClose={() => setCurrentPlaceId(null)}
 // closeButton={true}
 // closeOnClick={false}

 anchor="left" >
 <div className="card">            
   <label>Place</label>
   <h4 className="place">{p.title}</h4>
   <label>Review</label>
   <p className="desc">{p.desc}</p>
   <label>Rating</label>
   <div className="star">

     {Array(p.rating).fill( <Star className="star" />)}
 

   </div>
   <label>Information</label>
   <span className="userName">Created by <b>{p.username}</b></span>
   <span className="date">{format(p.createdAt)}</span>

 </div>
</Popup> 
)  }

    </>

    ))}
    {newPlace && (
        <Popup
        latitude={newPlace.lat}
        longitude={newPlace.long}
        // onClose={() => setNewPlace(null)}
        // closeButton={true}
        // closeOnClick={false}

        anchor="left" >     
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Title</label>
            <input placeholder="Enter a Title"
            onChange={(e) => handleTitle(e.target.value) }
            />
            <label>Review</label>
            <textarea 
            onChange={(e) => handleDesc(e.target.value)} 
            placeholder="Enter a Review" />
            <label>Rating</label>
            <select onChange={(e) => setNewRating(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option> 
              <option value="5">5</option>             
            </select>
            <button className="submitButton" type='submit'>
              Add Pin
            </button>

          </form>          
        </div> 
        </Popup>

    )}
   
   
      {currentUser ? (<button 
        onClick={() => handleLogout()}
      className="button logout">Logout</button>) : 
      (<div className="buttons">
        <button onClick={() => setShowLogin(true)} className="button login">Login</button>
        <button onClick={() => setShowRegister(true)}  className="button register">Register</button>
   </div>)}
   
   {showRegister &&  <Register setShowRegister={setShowRegister} />}
   {showLogin && <Login setCurrentUser={setCurrentUser}
        myStorage={myStorage}
       setShowLogin={setShowLogin} />  }
 
    
  </ReactMapGL>
 
  );
}

export default App;
