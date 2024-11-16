import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const useRoomOwner = (roomId: string | undefined) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkIfOwner = async () => {
      if (!roomId) return;
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        setIsOwner(roomSnap.data()?.host === auth.currentUser?.uid);
      }
    };

    checkIfOwner();
  }, [roomId]);

  return isOwner;
};

export default useRoomOwner;
