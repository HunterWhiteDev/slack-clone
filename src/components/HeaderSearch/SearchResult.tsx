import { Timestamp, doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import db from "../../firebase";
import moment from "moment";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

interface SearchResultProps {
  message: string;
  id: string;
  timestamp: Timestamp;
  user: string;
  setShowSearch: Function;
}

function SearchResult({
  message,
  id,
  timestamp,
  user,
  setShowSearch,
}: SearchResultProps) {
  const [state, dispatch] = useStateValue();

  const handleClick = () => {
    dispatch({
      type: actionTypes.SET_SCROLL,
      scroll: id,
    });
    setShowSearch(false);
  };

  return (
    <div className="searchResult" onClick={handleClick}>
      <h2>{user}</h2>
      {message.slice(0, 100)}
      {message.length >= 100 && "..."}
      <p>{moment(timestamp?.toDate()).format("h:mm:ss a MMMM Do YYYY, ")}</p>
    </div>
  );
}

export default SearchResult;
