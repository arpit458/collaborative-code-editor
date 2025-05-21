const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")
const ACTIONS = require("./src/Actions")

const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("build"))
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

const userSocketMap = {}
const roomPasswords = {} // Store room passwords

function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    }
  })
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id)

  socket.on(ACTIONS.JOIN, ({ roomId, username, password }) => {
    // Check if room exists and has a password
    if (roomPasswords[roomId]) {
      // Validate password
      if (roomPasswords[roomId] !== password) {
        // Invalid password
        socket.emit(ACTIONS.INVALID_PASSWORD)
        return
      }
    } else {
      // If room doesn't exist yet, create it with the provided password
      roomPasswords[roomId] = password
    }

    // Password is valid or room is new, proceed with join
    userSocketMap[socket.id] = username
    socket.join(roomId)
    const clients = getAllConnectedClients(roomId)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      })
    })
  })

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
  })

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
  })

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms]
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      })
    })
    delete userSocketMap[socket.id]
    socket.leave()
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
