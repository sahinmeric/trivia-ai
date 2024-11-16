import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

const useRoomActions = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createRoom = async () => {
    setError(null);
    try {
      const roomRef = await addDoc(collection(db, "rooms"), {
        host: auth.currentUser?.uid,
        players: [
          { uid: auth.currentUser?.uid, name: auth.currentUser?.email },
        ],
        state: "waiting",
      });
      navigate(`/lobby/${roomRef.id}`);
    } catch (err) {
      console.error("Failed to create room:", err);
      setError("Failed to create room. Please try again.");
    }
  };

  const joinRoom = async (code: string) => {
    setError(null);
    try {
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        await updateDoc(roomRef, {
          players: arrayUnion({
            uid: auth.currentUser?.uid,
            name: auth.currentUser?.email,
          }),
        });
        navigate(`/lobby/${code}`);
      } else {
        setError("Room not found. Please check the code.");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Error joining room. Please try again.");
    }
  };

  return { createRoom, joinRoom, error };
};

export default useRoomActions;
