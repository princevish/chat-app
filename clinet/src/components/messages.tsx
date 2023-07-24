import { Socket } from "socket.io-client";
import { useState, useEffect } from "react";

interface MessagesProps {
  socket: Socket;
}

interface IMessage {
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
    <div className="h-85v overflow-auto px-10 py-10 pl-40">
      {messagesRecieved.map((msg: IMessage, i) => (
        <div
          className="bg-blue-900 rounded-6 mb-10 max-w-600 p-6 rounded-md"
          key={i}
        >
          <div className="flex justify-between">
            <span className="text-blue-300 text-xs">{msg.username}</span>
            <span className="text-blue-300 text-xs">
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className="text-white">{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
