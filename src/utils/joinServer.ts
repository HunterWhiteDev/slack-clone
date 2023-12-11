import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import db from "../firebase";

const joinServer = async (uid: string, inviteCode: string) => {
  // Refactor to query for invite code and then join that server
  const serversRef = collection(db, `servers`);
  const q = query(serversRef, where("inviteCode", "==", inviteCode));
  const response = await getDocs(q);
  let server;

  response.forEach(async (record) => {
    server = { ...record.data(), id: record.id };
    const userRef = doc(db, `users/${uid}/servers/${record.id}`);
    await setDoc(userRef, {
      serverId: server.id,
      id: server.id,
      joinDate: serverTimestamp(),
      role: "owner",
    });
  });

  return server;
};

export default joinServer;
