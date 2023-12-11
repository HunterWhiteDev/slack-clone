import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

const getServer = async (id: string) => {
  const docRef = doc(db, `servers/${id}`);
  const docRes = await getDoc(docRef);
  const docData: any = docRes.data();

  return docData;
};

export default getServer;
