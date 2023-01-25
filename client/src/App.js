import {useState} from 'react'
import io from 'socket.io-client' // client side library for socket.io connection
import './App.css';
import Chat from './Chat';

// connect to socket server
let socket = io.connect('http://localhost:3001')

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")

  const [joinedRoom, setJoinedRoom] = useState(false)

  const joinRoom = (e)=>{
    e.preventDefault()
    if(username!=="" && room!=="")
    {
      // emit join_room event on which backend is socketio is listening on the event to join the room
      socket.emit('join_room', room) // passing the room_id as the second argument
    }

    setJoinedRoom(true)
    
  }

  return (
    <>
    <div className="container">
      <div className='alert'>Enter both 'Name' and 'Room id' to join a chat</div>
      {!joinedRoom && 
        <div className="box">
          <h1>Join a Chat</h1>
          
          <form className="join-room" onSubmit={joinRoom}>
            <div className="name mb-3">
              {/* <label htmlFor="username" className="form-label">Name</label> */}
              <h2 className='label'>Name</h2>
              <input type="text" className="form-control" id="username" placeholder="Enter name" 
              value = {username}
              onChange = {(e)=> setUsername(e.target.value)}
              />
            </div>
            <div className="name mb-3">
              {/* <label htmlFor="room" className="form-label">Room Id</label> */}
              <h2 className='label'>Room</h2>
              <input type="text" id="room" placeholder="Enter room id" 
              value = {room}
              onChange = {(e)=>{setRoom(e.target.value)}}
              />
            </div>

            <button type="submit" className="btn">Join Room</button>
          </form>
        </div>
      }
      
      {/* If the user has joined a room then show then only chat window */}
      { joinedRoom && <Chat socket={socket} username={username} room={room}/>}
        
      </div>
    </>
  );
}

export default App;
