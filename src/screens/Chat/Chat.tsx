import { InfoOutlined } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import db from "../../firebase";
import Message from "./Message";
import ChatInput from "./ChatInput";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useRef } from "react";
import getChatDetails from "../../utils/getChatDetails";
import { RouteParams } from "../../types";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

interface chatDetailsInterface {
  name: string;
  id: string;
  creation_date: number | string;
}

function Chat(props: any) {
  const { roomId, serverId } = useParams<RouteParams>();
  const [{ messages, scroll }, dispatch]: [
    { messages: any; scroll: string },
    any
  ] = useStateValue();
  const [chatDetails, setChatDetails] = useState<chatDetailsInterface | null>(
    null
  );
  const [userNames, setUserNames] = useState<any>({});
  const chatDiv = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //Get chat room details
  useEffect(() => {
    const getChat = async () => {
      try {
        const detailsResponse = await getChatDetails(serverId, roomId);
        setChatDetails(detailsResponse);
      } catch (error) {
        console.log(error);
      }
    };

    getChat();
  }, [roomId]);

  //get each users individual name
  const getUserName = async (uid: string) => {
    if (userNames.uid) {
      return;
    } else {
      const docRef = doc(db, `users/${uid}`);
      const docRes = await getDoc(docRef);
      const docData = docRes.data();

      setUserNames({ ...userNames, [uid]: docData?.username });
    }
  };

  //Listen for new messages
  useEffect(() => {
    const collectionRef = collection(
      db,
      `servers/${serverId}/textChannels/${roomId}/messages`
    );

    const q = query(collectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      //Get changes and dispatch to global state
      const messagesArr: any = [];
      snapshot.docs.forEach(async (doc) => {
        const docData = doc.data();
        const uid = docData.user;
        getUserName(uid)
          .then()
          .catch((error) => alert(error));
        messagesArr.push({ ...docData, id: doc.id });
      });

      dispatch({
        messages: messagesArr,
        type: actionTypes.SET_MESSAGES,
      });

      //Scroll to most recent message
      chatDiv.current && chatDiv.current.scrollIntoView();
    });
    return () => unsubscribe();
  }, [roomId]);

  //Handle Auto scroll
  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const id: string = scroll;
    if (id !== null && messagesRef.current[id]) {
      messagesRef.current[id]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scroll]);

  return (
    <div className="chat" ref={chatDiv}>
      {/* <div className="chat__header">
        <div className="chat__headerRight">
          <p>
            <InfoOutlined /> Details
          </p>
        </div>
      </div> */}
      <div className="chat__messages">
        {messages?.map(
          ({
            message: text,
            timestamp,
            user,
            userImage,
            id,
          }: {
            message: string;
            timestamp: Timestamp;
            user: any;
            userImage?: any;
            id: string;
          }) => (
            <Message
              message={text}
              timestamp={timestamp}
              user={user}
              userNames={userNames}
              refProp={(ref: HTMLDivElement | null) =>
                (messagesRef.current[id] = ref)
              }
            />
          )
        )}
      </div>
      <ChatInput chatDetails={chatDetails} />
    </div>
  );
}

export default Chat;
