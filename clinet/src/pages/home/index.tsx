import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface HomeProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
}

const Home: React.FC<HomeProps> = ({
  username,
  setUsername,
  room,
  setRoom,
  socket,
}) => {
  const navigate = useNavigate();

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }

    navigate("/chat", { replace: true });
  };

  return (
    <div
      className={
        "min-h-screen w-full flex justify-center items-center bg-blue-500"
      }
    >
      <div
        className={
          "w-400 mx-auto p-8 bg-sky-100 rounded-md flex flex-col items-center gap-7 border-2"
        }
      >
        <h1 className={"text-3xl font-bold text-center"}>
          Rate-limited Chat Room
        </h1>
        <input
          className={
            "w-full p-3 rounded-md border border-blue-300 text-sm"
          }
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select
          className={"w-full p-3 rounded-md border border-blue-500 text-sm"}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          <option value="javascript">JavaScript</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option>
        </select>

        <button
          className="px-4 py-4 rounded-md font-bold text-lg cursor-pointer border-none bg-blue-500 text-white"
          style={{ width: "100%" }}
          onClick={joinRoom}
          disabled={room === "" || username === ""}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
