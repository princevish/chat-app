import { Socket } from "socket.io-client";
import styles from "./styles.module.css";
import React, { useState } from "react";

interface SendMessageProps{
    username: string,
    room: string,
    socket: Socket
}

const SendMessage: React.FC<SendMessageProps> = ({
  socket,
  username,
  room,
}) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.on("rateLimitExceeded", (data) => {
        window.alert(data);
      });
      socket.emit("send_message", { username, room, message, __createdtime__ });

      setMessage("");
    }
  };

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default SendMessage;
