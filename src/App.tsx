import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./screens/Chat/Chat";
import Login from "./screens/Login/Login";
import { useStateValue } from "./StateProvider";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db, { auth } from "./firebase";
import { useEffect } from "react";
import NoServers from "./screens/NoServers/NoServers";
import { useHistory } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { actionTypes } from "./reducer";
function App() {
  const [{ user }, dispatch] = useStateValue();
  const [emptyServerList, setEmptyServerList] = useState(true);

  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const history = useHistory();

  const getServer = async (serverId: string) => {
    const docRef = doc(db, `servers/${serverId}`);
    const docResponse = await getDoc(docRef);
    history.push(`/${docResponse.id}`);
  };
  //Listen for logins/logouts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log(user.uid);
      const docRef = doc(db, `users/${user?.uid}`);
      const docRes = await getDoc(docRef);
      const docData = docRes.data();

      if (user) {
        dispatch({
          user: { ...user, username: docData?.username || user.email },
          type: actionTypes.SET_USER,
        });

        const serversRef = collection(db, `users/${user.uid}/servers`);
        const results = await getDocs(serversRef);
        if (results.size === 0) {
          setEmptyServerList(true);
        } else {
          let server: any;
          results.forEach((doc) => {
            if (server) return;
            else server = getServer(doc.id);
          });

          setEmptyServerList(false);
          setHasLoggedIn(true);
        }
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    //This should only run one time once the user logs in. (Might move this code into the auth state change listener above)
    if (user && !hasLoggedIn) {
      const getUserServers = async () => {};

      getUserServers();
    }
  }, [user]);

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <div className="app">
          <div className="app__body">
            {emptyServerList ? (
              <>
                <Header />
                <NoServers setEmptyServerList={setEmptyServerList} />
              </>
            ) : (
              <Switch>
                <Route path="/:serverId/:roomId">
                  <Header />
                  <Sidebar />
                  <Chat />
                </Route>

                <Route path="/:serverId">
                  <Header />
                  <Sidebar />
                </Route>
              </Switch>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
