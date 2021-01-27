import { Avatar } from "@material-ui/core";
import {
  AccessTimeOutlined,
  HelpOutlineOutlined,
  SearchOutlined,
} from "@material-ui/icons";
import React from "react";
import "./Header.css";
import { useStateValue } from "./StateProvider";
function Header() {
  const [{ user }] = useStateValue();
  return (
    <div className="header">
      <div className="header__left">
        <Avatar
          className="header__avatar"
          alt={user?.displayName}
          src={user?.photoURL}
        />

        <h3>{user?.displayName}</h3>
        <AccessTimeOutlined />
        {/* Time Icon */}
      </div>

      <div className="header__search">
        <SearchOutlined />
        <input placeholder="Search Clever Programmer" />
        {/* Input */}
      </div>

      <div className="header__right">
        <HelpOutlineOutlined />
      </div>
    </div>
  );
}

export default Header;
