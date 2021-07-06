
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import Star from '@material-ui/icons/Star'
import axios from 'axios'
import {format} from 'timeago.js'
import './App.css';



function App() {
  const [pins, setPins] = useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null)

  useEffect(() => {
    const url = "http://localhost:8080/api/allPins"
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

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id)
  }

  return (

    <ReactMapGL 
    {...viewport}
    const mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX}
    mapStyle="mapbox://styles/si3mshady/ckqr1pgbq3dtl17mo79rzts2p"
    onViewportChange={nextViewport => setViewport(nextViewport)} 
    >
   
    {pins.map(p => (
<>
<Marker latitude={p.lat} longitude={p.long} 
offsetLeft={-20} offsetTop={-10}  >    

<RoomIcon
onClick={() => handleMarkerClick(p._id)}
style={{fontSize:viewport.zoom * 6, color: "red"}}></RoomIcon>

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
   <div className="start">
   <Star className="star" />
   <Star className="star" />
   <Star className="star" />
   <Star className="star" />
   <Star className="star" />
   </div>
   <label>Information</label>
   <span className="userName">Created by <b>{p.username}</b></span>
   <span className="date">{format(p.createdAt)}</span>

 </div>
</Popup> 
)  }

    </>

    ))}
    
    
  </ReactMapGL>
 
  );
}

export default App;
