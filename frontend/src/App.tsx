import { useState } from "react";
import Home from "./pages/home/Index";
import Chat from "./pages/chat/Index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat"
            element={<Chat username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
