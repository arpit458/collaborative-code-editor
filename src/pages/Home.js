"use client"

import { useState } from "react"
import { v4 as uuidV4 } from "uuid"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [createPassword, setCreatePassword] = useState("")

  const createNewRoom = (e) => {
    e.preventDefault()
    if (!username) {
      toast.error("Username is required")
      return
    }
    if (!createPassword) {
      toast.error("Password is required to create a room")
      return
    }

    const id = uuidV4()
    setRoomId(id)
    setPassword(createPassword)
    toast.success("Created a new room")
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required")
      return
    }

    if (!password) {
      toast.error("Password is required to join the room")
      return
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
        password,
      },
    })
  }

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom()
    }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/code-sync.png" alt="code-sync-logo" />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <input
            type="password"
            className="inputBox"
            placeholder="ROOM PASSWORD"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
          {roomId === "" && (
            <div className="inputGroup" style={{ marginTop: "20px" }}>
              <input
                type="text"
                className="inputBox"
                placeholder="USERNAME FOR NEW ROOM"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <input
                type="password"
                className="inputBox"
                placeholder="PASSWORD FOR NEW ROOM"
                onChange={(e) => setCreatePassword(e.target.value)}
                value={createPassword}
              />
            </div>
          )}
        </div>
      </div>
      <footer>
        <h4></h4>
      </footer>
    </div>
  )
}

export default Home
