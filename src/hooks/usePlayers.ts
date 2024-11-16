import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface Player {
  uid: string;
  name: string;
}

const usePlayers = (roomId: string | undefined) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [ownerId, setOwnerId] = useState<string>("");

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setPlayers(roomData?.players || []);
        setOwnerId(roomData?.host);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  return { players, ownerId };
};

export default usePlayers;
