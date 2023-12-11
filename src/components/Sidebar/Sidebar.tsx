import { Input } from "@mui/material";
import { Add, Create, KeyboardVoice, Message, Link } from "@mui/icons-material";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarOption from "./SidebarOption";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import db from "../../firebase";
import Modal from "../Modal/Modal";
import { useHistory, useParams } from "react-router-dom";
import { RouteParams } from "../../types";
import getServer from "../../utils/getServer";

function Sidebar() {
  const [textChannels, setTextChannels] = useState<any>([]);
  const [voiceChannels, setVoiceChannels] = useState<any>([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalJsx, setModalJsx] = useState<any>(null);
  const [clickText, setClickText] = useState("Okay");
  const [modalStatus, setModalStatus] = useState("create_text");
  const [channelName, setChannelName] = useState<any>("");
  const [channelId, setChannelId] = useState<string>("");
  const [server, setServer] = useState<any>();
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const { serverId } = useParams<RouteParams>();
  const history = useHistory();

  useEffect(() => {
    const getChannels = async () => {
      const textChannelsRef = collection(
        db,
        `servers/${serverId}/textChannels`
      );

      // const textChannelsRes = await getDocs(textChannelsRef);

      const textSnapShot = onSnapshot(textChannelsRef, (snapshot) => {
        const textChannelsArr: any[] = [];

        snapshot.forEach((doc) => {
          textChannelsArr.push({ ...doc.data(), id: doc.id });
        });

        setTextChannels(textChannelsArr);
        const firstChannelId = textChannelsArr[0]?.id;
        setChannelId(firstChannelId);
        history.push(`${serverId}/${firstChannelId}`);
      });

      // ---- START OF VOICE ---- \\

      const voiceChannelsRef = collection(
        db,
        `servers/${serverId}/voiceChannels`
      );

      const voiceSnapShot = onSnapshot(voiceChannelsRef, (snapshot) => {
        const voiceChannelsArr: any[] = [];

        snapshot.forEach((doc) => {
          voiceChannelsArr.push({ ...doc.data(), id: doc.id });
        });

        setVoiceChannels(voiceChannelsArr);
      });
    };

    getChannels();
  }, [serverId]);

  // Get Server
  useEffect(() => {
    const fetchServer = async () => {
      const server = await getServer(serverId);
      setServer(server);
    };

    fetchServer();
  }, [serverId]);

  const handleCreateText = () => {
    setClickText("Create a new channel");
    setModalJsx(
      <Input
        onChange={(e) => setChannelName(e.target.value as string)}
        placeholder="Channel Name..."
      />
    );
    setOpenModal(true);
    setModalStatus("create_text");
  };

  const onCreate = async () => {
    if (modalStatus === "create_text") {
      const id = crypto.randomUUID();
      const ref = doc(db, `servers/${serverId}/textChannels/${id}`);
      await setDoc(ref, {
        name: channelName,
        creation_date: serverTimestamp(),
      });
    } else {
      const id = crypto.randomUUID();
      const ref = doc(db, `servers/${serverId}/voiceChannels/${id}`);
      await setDoc(ref, {
        name: channelName,
        creation_date: serverTimestamp(),
      });
    }
  };

  const handleCreateVoice = () => {
    setClickText("Create a new channel");
    setModalJsx(
      <Input
        onChange={(e) => setChannelName(e.target.value as string)}
        placeholder="Channel Name..."
      />
    );
    setOpenModal(true);
    setModalStatus("create_voice");
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(server.inviteCode).then(
      () => {
        setHasCopied(true);
        setTimeout(() => {
          setHasCopied(false);
        }, 1000);
      },
      () => {
        console.error("Failed to copy");
      }
    );
  };

  return (
    <div className="sidebar">
      <Modal
        content={modalJsx}
        title="Create a new channel"
        open={openModal}
        setOpen={setOpenModal}
        clickText={clickText}
        onClick={onCreate}
      />
      {/* <div className="sidebar__header"> */}
      {/* <div className="sidebar__info"></div>
        <Create /> */}
      {/* </div> */}
      <SidebarOption
        addChannelOption
        Icon={Add}
        title="Add Text Channel"
        id={"ADD_TEXT"}
        handleCreate={handleCreateText}
      />
      {textChannels.map((channel: any) => (
        <SidebarOption
          title={channel.name}
          id={channel.id}
          channelId={channelId}
          setChannelId={setChannelId}
          Icon={Message}
        />
      ))}
      <hr />
      <SidebarOption
        Icon={Add}
        addChannelOption
        title="Add Voice Channel"
        handleCreate={handleCreateVoice}
      />

      {voiceChannels.map((channel: any) => (
        <SidebarOption
          title={channel.name}
          id={channel.id}
          channelId={channelId}
          setChannelId={setChannelId}
          Icon={KeyboardVoice}
          voiceChannel
        />
      ))}

      <div className="sidebar__footer">
        <ul>
          <li onClick={handleCopyInvite}>
            {hasCopied ? (
              <p>Copied!</p>
            ) : (
              <>
                <p>Copy Invite Code</p> <Link className="sidebar__footerIcon" />
              </>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
