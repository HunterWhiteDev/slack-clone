import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import db from "../firebase";

interface ChatDetails {
  id: string;
  name: string;
  creation_date: number | string;
  // Add other properties as needed
}

const getChatDetails = async (
  serverId: string,
  chatId: string
): Promise<ChatDetails> => {
  const docRef = doc(db, `servers/${serverId}/textChannels/${chatId}`);
  const docResponse: DocumentSnapshot<DocumentData> = await getDoc(docRef);

  // Assuming the actual data structure inside the document, adjust the types accordingly
  const data = docResponse.data();

  if (data) {
    return { id: docResponse.id, ...data } as ChatDetails;
  } else {
    throw new Error("Chat details not found");
  }
};

export default getChatDetails;
