import { SearchOutlined, ExpandMore } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import "./Header.css";
import { useStateValue } from "../../StateProvider";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import db from "../../firebase";
import ServerList from "../ServerList/ServerList";
import { useEffect } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import getServer from "../../utils/getServer";
import { RouteParams } from "../../types";
import ProfileOptions from "../ProfileOptions/ProfileOptions";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import { actionTypes } from "../../reducer";

interface SelectedServer {
  name: string;
  creation_date: any;
  id: string;
}

function Header() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<any | null>(null);
  const nameRef = useRef<any | null>(null);
  const profileOptionsRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [{ user, search }, dispatch]: [{ user: any; search: any }, any] =
    useStateValue();

  const [showServers, setShowServers] = useState<boolean>(false);
  const [serverList, setServerList] = useState([]);
  const [selectedServer, setSelectedServer] = useState<SelectedServer | any>(
    {}
  );

  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const { serverId } = useParams<RouteParams>();

  const getServers = async () => {
    const docRef = collection(db, `users/${user.uid}/servers`);
    // const docs = await getDocs(docRef);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const servers: any = [];

      snapshot.forEach(
        async (doc) =>
          serverId !== doc?.id && servers.push(await getServer(doc.id))
      );
      setServerList(servers);
    });

    return () => unsubscribe();
  };

  useEffect((): any => {
    const getName = async () => {
      const serverName = await getServer(serverId);
      setSelectedServer(serverName);
    };

    getName();
    getServers();

    return getServers;
  }, [serverId]);

  //Click Listener for server list
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        // Clicked outside the dropdown, close the menu
        setShowServers(false);
      } else {
        setShowServers(true);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  //Fire after a user clicks a server option
  const onServerChange = () => {
    setShowServers(false);
  };

  const handleShowServer = (
    e: React.MouseEvent<HTMLDivElement | HTMLSpanElement>
  ) => {
    if (e.target === e.currentTarget) {
      setShowServers(true);
    }
  };

  //Click Listener for profile options
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileOptionsRef.current &&
        !profileOptionsRef.current.contains(e.target as Node)
      ) {
        // Clicked outside the dropdown, close the menu
        setShowProfileOptions(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      dispatch({
        type: actionTypes.SET_SERACH,
        search: { status: "SEARCH", result: val },
      });
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        // Clicked outside the dropdown, close the menu
        setShowSearch(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="header">
      <div className="header__left">
        <div
          ref={contentRef}
          className={`header__leftContent ${
            showServers ? "header__leftContentOpen" : null
          }`}
          onClick={(e) => handleShowServer(e)}
        >
          <h1 onClick={(e) => handleShowServer(e)} ref={nameRef}>
            {selectedServer?.name || "Select Server..."}
          </h1>
          <span onClick={(e) => handleShowServer(e)}>
            <ExpandMore ref={chevronRef} />
          </span>

          {showServers && (
            <ServerList
              servers={serverList}
              onChange={onServerChange}
              setShowServers={setShowServers}
            />
          )}
        </div>
      </div>

      <div
        className={` ${
          showSearch && "header__searchShowServers"
        } header__search`}
      >
        <SearchOutlined />
        <input placeholder="Search..." onChange={handleSearch} />
        {/* Input */}
        {showSearch && (
          <HeaderSearch refProp={searchRef} setShowSearch={setShowSearch} />
        )}
      </div>

      <div className="header__right" ref={profileOptionsRef}>
        <h3 onClick={() => setShowProfileOptions(true)}>{user?.username}</h3>
        {showProfileOptions && <ProfileOptions />}
      </div>
    </div>
  );
}

export default Header;
