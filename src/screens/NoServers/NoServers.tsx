import React, { ChangeEvent } from "react";
import "./NoServers.css";
import { Add, Link } from "@mui/icons-material";
import Modal from "../../components/Modal/Modal";
import { useState } from "react";
import { Input } from "@mui/material";
import db from "../../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useStateValue } from "../../StateProvider";
import genInvCode from "../../utils/genInvCode";
import { useHistory } from "react-router-dom";
import joinServer from "../../utils/joinServer";

interface NoServersProps {
  setEmptyServerList: any;
}

function NoServers({ setEmptyServerList }: NoServersProps) {
  const [open, setOpen] = useState(false);
  const [modalJsx, setModalJsx] = useState(<></>);
  const [serverName, setServerName] = useState("");
  const [clickText, setClickText] = useState("Okay");
  const [modalStatus, setModalStatus] = useState<"create" | "join">("create");
  const [inviteCode, setInviteCode] = useState<string>("");

  const [{ user }] = useStateValue();

  const history = useHistory();

  const handleCreate = () => {
    setClickText("Create a new server");
    setModalJsx(
      <Input
        onChange={(e) => setServerName(e.target.value)}
        placeholder="Server Name"
      />
    );
    setOpen(true);
    setModalStatus("create");
  };

  const handleJoin = () => {
    setClickText("Join a new server");

    setModalJsx(
      <Input
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder="Invite Link"
      />
    );
    setOpen(true);
    setModalStatus("join");
  };

  const onCreate = async () => {
    const serverId = crypto.randomUUID();
    const serverResponse = await setDoc(doc(db, "servers", serverId), {
      id: serverId,
      name: serverName,
      creationDate: serverTimestamp(),
      owner: user.uid,
      inviteCode: genInvCode(),
    });

    const textChannelId = crypto.randomUUID();

    const textChannelResponse = await setDoc(
      doc(db, `servers/${serverId}/textChannels/${textChannelId}`),
      {
        name: "general",
        creation_date: serverTimestamp(),
      }
    );

    const userResponse = await setDoc(
      doc(db, `users/${user.uid}/servers`, serverId),
      {
        serverId: serverId,
        id: serverId,
        joinDate: serverTimestamp(),
        role: "owner",
      }
    );

    setEmptyServerList(false);
    history.push(`/${serverId}`);
  };

  const onJoin = async () => {
    const response: any = await joinServer(user.uid, inviteCode);
    if (response) {
      history.push(`${response.id}`);
      setEmptyServerList(false);
    }
  };

  return (
    <div className="noServers">
      <Modal
        content={modalJsx}
        title="Enter Server Name..."
        open={open}
        setOpen={setOpen}
        clickText={clickText}
        onClick={modalStatus === "join" ? onJoin : onCreate}
      />
      <h1>Find or join your first server!</h1>
      <div className="noServers__ItemBoxContainer">
        <div className="itemBox" onClick={handleCreate}>
          <Add className="itemBox__icon" />
          <p>Create Server</p>
        </div>

        <div className="itemBox" onClick={handleJoin}>
          <Link className="itemBox__icon" />
          <p>Join Server</p>
        </div>
      </div>
    </div>
  );
}

export default NoServers;
