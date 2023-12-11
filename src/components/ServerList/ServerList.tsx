import React, { useState } from "react";
import "./ServerList.css";
import { Add, Link } from "@mui/icons-material";
import { Input } from "@mui/material";
import Modal from "../Modal/Modal";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { useHistory } from "react-router-dom";
import joinServer from "../../utils/joinServer";

interface ServerListProps {
  servers: any[];
  onChange: Function;
  setShowServers: Function;
}

function ServerList(props: ServerListProps) {
  const { servers, onChange, setShowServers } = props;
  const [{ user }] = useStateValue();
  const history = useHistory();

  //Modal Varriables
  const [open, setOpen] = useState(false);
  const [clickText, setClickText] = useState("");
  const [modalJsx, setModalJsx] = useState(<></>);
  const [serverName, setServerName] = useState("");

  const [inviteCode, setInviteCode] = useState<string>("");
  const [join, setJoin] = useState(false);

  const handleCreate = () => {
    setJoin(false);
    setClickText("Create a new server");
    setModalJsx(
      <Input
        onChange={(e) => setServerName(e.target.value)}
        placeholder="Server Name"
      />
    );
    setOpen(true);
  };

  const onCreate = async () => {
    const serverId = crypto.randomUUID();
    const serverResponse = await setDoc(doc(db, "servers", serverId), {
      id: serverId,
      name: serverName,
      creationDate: serverTimestamp(),
      owner: user.uid,
    });

    const userResponse = await setDoc(
      doc(db, `users/${user.uid}/servers`, serverId),
      {
        serverId: serverId,
        id: serverId,
        joinDate: serverTimestamp(),
        role: "owner",
      }
    );
  };

  const onClick = (server: any) => {
    history.push(`/${server?.id}`);
    setShowServers(false);
  };

  const handleJoin = () => {
    setOpen(true);
    setJoin(true);

    setClickText("Join Server");
    setModalJsx(
      <Input
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder="Invite code"
      />
    );
  };

  const onJoin = async () => {
    const response: any = await joinServer(user.uid, inviteCode);
    if (response) {
      history.push(`/${response.id}`);
    }
  };

  return (
    <div className="serverList__content">
      <div className="serverList__servers">
        {/* Do some modal stuff here */}
        <Modal
          content={modalJsx}
          title="Create a Server"
          open={open}
          setOpen={setOpen}
          clickText={clickText}
          onClick={join ? onJoin : onCreate}
        />
        <h1 onClick={handleCreate}>
          <Add /> <span>New Server</span>
        </h1>

        <h1 onClick={handleJoin}>
          <Link /> <span>Join Server </span>
        </h1>

        {servers.map((server) => (
          <h1 key={server.id} onClick={() => onClick(server)}>
            {server?.name}
          </h1>
        ))}
      </div>
    </div>
  );
}

export default ServerList;
