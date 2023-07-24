import RoomAndUsersColumn from "../../components/room-and-users"; // Add this
import SendMessage from "../../components/send-message";
import MessagesReceived from "../../components/messages";
import { Socket } from "socket.io-client";

interface ChatProps {
  username: string;
  room: string;
  socket: Socket;
}

const Chat: React.FC<ChatProps> = ({ username, room, socket }) => {
  return (
    <div style={styles.chatContainer}>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;

const styles = {
  chatContainer: {
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 4fr",
    gap: "20px",
  },
};
