import { Socket } from "socket.io-client";
import React, { useState } from "react";

interface SendMessageProps {
  username: string;
  room: string;
  socket: Socket;
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

      socket.emit("send_message", { username, room, message, __createdtime__ });
      socket.on("rateLimitExceeded", (data) => {
        window.alert(data);
      });

      setMessage("");
    }
  };

  return (
    <div className={"flex p-4"}>
      <input
        className="flex-2 p-5 mr-10 w-3/4 rounded-md border border-blue-300 text-sm"
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button
        className="w-1/4 px-4 py-4 rounded-md font-bold text-lg cursor-pointer border-none bg-blue-500 text-white"
        onClick={sendMessage}
      >
        Send Message
      </button>
    </div>
  );
};

export default SendMessage;
