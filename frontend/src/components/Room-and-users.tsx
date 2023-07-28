import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface User {
  id: number;
  username: string;
}

interface RoomAndUsersProps {
  socket: Socket;
  username: string;
  room: string;
}

const RoomAndUsers: React.FC<RoomAndUsersProps> = ({
  socket,
  username,
  room,
}) => {
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chatroom_users", (data: User[]) => {
      setRoomUsers(data);
    });

    return () => {socket.off("chatroom_users");};
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    navigate("/", { replace: true });
  };

  return (
    <div className={"border-r border-gray-300"}>
      <h2 className="mb-5 uppercase text-2xl p-5 text-center">{room}</h2>
      <div className="p-5">
        {roomUsers.length > 0 && <h5 className="text-lg">Users:</h5>}
        <ul className="list-none pl-0 mb-10 text-blue-300">
          {roomUsers.map((user, index) => (
            <li
              style={{
                fontWeight: user.username === username ? "bold" : "normal",
              }}
              key={index}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="m-5 px-4 py-2 text-center rounded-md font-bold text-lg cursor-pointer border-outline bg-blue-500 text-white"
        onClick={leaveRoom}
      >
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;
