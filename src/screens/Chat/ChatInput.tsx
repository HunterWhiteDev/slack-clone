import React, { useState } from "react";
import "./ChatInput.css";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import getServer from "../../utils/getServer";
import { RouteParams } from "../../types";

interface chatDetails {
  name: string;
  id: string;
  creation_date: number | string;
}

interface propTypes {
  chatDetails: chatDetails | null;
}

function ChatInput(props: propTypes) {
  const { chatDetails } = props;

  const [input, setInput] = useState("");

  const [{ user }] = useStateValue();
  const { serverId, roomId } = useParams<RouteParams>();

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = crypto.randomUUID();

    const docRef = doc(
      db,
      `servers/${serverId}/textChannels/${roomId}/messages/${id}`
    );

    await setDoc(docRef, {
      user: user.uid,
      message: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  useEffect(() => {}, []);

  return (
    <div className="chatInput">
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${chatDetails?.name?.toLowerCase()}`}
        />
      </form>
    </div>
  );
}

export default ChatInput;
