import { Socket } from "socket.io-client";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

interface MessagesProps {
    socket: Socket;
}

interface IMessage{
    username: string;
    __createdtime__: string;
    message: string;

}

const Messages: React.FC<MessagesProps> = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data: IMessage) => {
      setMessagesReceived((state: IMessage[]) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  function formatDateFromTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      {messagesRecieved.map((msg: IMessage, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
