import React, { useEffect, useState } from "react";
import "./HeaderSearch.css";
import SearchResult from "./SearchResult";
import { useStateValue } from "../../StateProvider";
import db from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

function HeaderSearch({
  refProp,
  setShowSearch,
}: {
  refProp: any;
  setShowSearch: any;
}) {
  const [{ search, messages }] = useStateValue();

  const [searchMessages, setSearchMessages] = useState<any>([]);
  const [userNames, setUserNames] = useState<any>({});

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

  useEffect(() => {
    if (search?.status === "SEARCH") {
      let currentSize = 0;
      const messagesArr = messages.filter((message: any) => {
        if (currentSize > 4) return false;
        if (
          message.message.toLowerCase().includes(search.result.toLowerCase())
        ) {
          getUserName(message.user);
          currentSize++;

          return true;
        } else {
          return false;
        }
      });
      setSearchMessages([...messagesArr]);
    }
  }, [search]);

  return (
    <div className="headerSearch" ref={refProp}>
      <p>Messsages:</p>
      {searchMessages.map((message: any) => (
        <SearchResult
          {...message}
          user={userNames[message.user]}
          setShowSearch={setShowSearch}
        />
      ))}
    </div>
  );
}

export default HeaderSearch;
