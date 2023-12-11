import React, { useState } from "react";
import "./ProfileOptions.css";
import ProfileOption from "./ProfileOption";
import { Edit, ExitToApp } from "@material-ui/icons";
import { Input } from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import Modal from "../Modal/Modal";
import db, { logOut, auth } from "../../firebase";

function ProfileOptions() {
  const [open, setOpen] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const [username, setUsername] = useState("");

  const modalJsx = (
    <Input
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter new name..."
    />
  );

  const handleUpdate = async () => {
    const docRef = doc(db, `users/${user.uid}`);
    await setDoc(docRef, { username }, { merge: true });
    dispatch({
      user: { ...user, username: username },
      type: actionTypes.SET_USER,
    });
  };

  const handleLogOut = () => {
    logOut(auth)
    dispatch({
      user: null,
      type: actionTypes.SET_USER
    })
  }

  return (
    <div className="profileOptions">
      <Modal
        open={open}
        setOpen={setOpen}
        title="Enter a new username"
        clickText="Okay"
        content={modalJsx}
        onClick={handleUpdate}
      />

      <ProfileOption
        title={"Edit Name"}
        Icon={Edit}
        onClick={() => setOpen(true)}
      />
      <ProfileOption
        title={"Logout"}
        Icon={ExitToApp}
        onClick={handleLogOut}
      />
    </div>
  );
}

export default ProfileOptions;
