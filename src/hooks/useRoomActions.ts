import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { mockQuestions } from "../MockQuestions";

const useRoomActions = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createRoom = async () => {
    setError(null);
    try {
      if (!auth.currentUser) {
        setError("User not authenticated.");
        return;
      }

      const roomRef = await addDoc(collection(db, "rooms"), {
        host: auth.currentUser.uid,
        players: [
          {
            uid: auth.currentUser.uid,
            name: auth.currentUser.email,
            score: 0,
          },
        ],
        state: "waiting",
        currentQuestion: 0,
        questions: mockQuestions,
        answers: {},
        timer: 10,
      });

      navigate(`/lobby/${roomRef.id}`);
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room. Please try again.");
    }
  };
  const joinRoom = async (code: string) => {
    setError(null);
    try {
      if (!auth.currentUser) {
        setError("User not authenticated.");
        return;
      }

      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const player = {
          uid: auth.currentUser.uid,
          name: auth.currentUser.email,
          score: 0,
        };

        await updateDoc(roomRef, {
          players: arrayUnion(player),
        });

        navigate(`/lobby/${code}`);
      } else {
        setError("Room not found.");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room. Please try again.");
    }
  };

  const startGame = async (roomId: string) => {
    setError(null);
    try {
      if (!roomId) {
        setError("Invalid room ID.");
        return;
      }

      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        state: "in-progress",
        currentQuestion: 0,
        timer: 10,
      });

      console.log(`Game started for room: ${roomId}`);
    } catch (err) {
      console.error("Failed to start game:", err);
      setError("Failed to start game. Please try again.");
    }
  };

  return { createRoom, joinRoom, startGame, error };
};

export default useRoomActions;
