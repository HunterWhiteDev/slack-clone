import React from "react";
import { useHistory } from "react-router-dom";
import db from "../../firebase";
import "./SidebarOption.css";
import { useParams } from "react-router-dom";
import { RouteParams } from "../../types";
import genInvCode from "../../utils/genInvCode";
interface SidebarOptionProps {
  Icon?: React.FunctionComponent<{ className: string }>;
  title: string;
  id?: string;
  addChannelOption?: boolean;
  handleCreate?: Function | (() => null);
  channelId?: string;
  setChannelId?: Function;
  voiceChannel?: boolean;
}

function SidebarOption(props: SidebarOptionProps) {
  const {
    Icon,
    title,
    id,
    addChannelOption,
    handleCreate = () => null,
    channelId,
    setChannelId,
    voiceChannel = false,
  } = props;
  const history = useHistory();
  const { serverId } = useParams<RouteParams>();

  const selectChannel = () => {
    if (voiceChannel) return alert("Voice chat coming soon");

    if (id && setChannelId) {
      if (voiceChannel) {
      } else {
        setChannelId(id);
        history.push(`/${serverId}/${id}`);
      }
    }
  };

  const addChannel = () => {
    handleCreate();
  };

  return (
    <div
      className="sidebarOption"
      onClick={addChannelOption ? addChannel : selectChannel}
      style={
        channelId === id && typeof id === "string"
          ? { backgroundColor: "#350E37" }
          : {}
      }
    >
      {Icon && <Icon className="sidebarOption__icon" />}

      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <h3 className="sidebarOption__channel">
          <span className="sidebarOption_hash"> # </span> {title}
        </h3>
      )}
    </div>
  );
}

export default SidebarOption;
