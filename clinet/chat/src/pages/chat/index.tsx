import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users"; // Add this
import SendMessage from "./send-message";
import MessagesReceived from "./messages";
import { Socket } from "socket.io-client";

interface ChatProps {
  username: string;
  room: string;
  socket: Socket;
}

const Chat: React.FC<ChatProps> = ({ username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      {/* Add this */}
      <RoomAndUsersColumn socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
