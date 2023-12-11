import React, { MouseEventHandler } from "react";
import "./Modal.css";
import { Close } from "@material-ui/icons";
import { useState } from "react";

interface ModalProps {
  open: boolean;
  setOpen: Function;
  title: string;
  content: any;
  onClick?: Function | (() => null);
  onClose?: Function | (() => null);
  clickText?: string;
}

function Modal(props: ModalProps) {
  const {
    open,
    setOpen,
    title = "",
    content,
    onClick = () => null,
    onClose = () => null,
    clickText = "Okay",
  } = props;
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleClick = () => {
    onClick();
    setOpen(false);
  };

  const closeOnBkgClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return open ? (
    <div className="modal__background" onClick={closeOnBkgClick}>
      <div className="modal__content">
        <p className="modal__contentTitle">{title}</p>
        <button className="modal__contentClose" onClick={handleClose}>
          <Close />
        </button>

        {content}

        <div className="modal__contentActions">
          <button
            className="modal__contentActionButton"
            style={{ backgroundColor: "red" }}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button onClick={handleClick} className="modal__contentActionButton">
            {clickText}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default Modal;
