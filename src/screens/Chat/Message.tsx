import React from "react";
import "./Message.css";
import { useStateValue } from "../../StateProvider";
import moment from "moment";
import { Timestamp } from "firebase/firestore";

interface MessageProps {
  message: string;
  timestamp: Timestamp;
  user: string;
  userNames: any;
  refProp: any;
}

function Message(props: MessageProps) {
  const { message, timestamp, user: uid, userNames, refProp } = props;
  const [{ user }] = useStateValue();

  return (
    <div
      ref={refProp}
      className={`message ${user.uid === uid ? "message-self" : null}`}
    >
      <div className={`message__info `}>
        <h3>{userNames[uid]}</h3>
        <p>{message}</p>
      </div>
      <span className="message__timestamp">
        {moment(timestamp?.toDate()).format("h:mm:ss a MMMM Do YYYY, ")}
      </span>
    </div>
  );
}

export default Message;
