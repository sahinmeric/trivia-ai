import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const GameLobby: React.FC = () => {
  const [roomCode, setRoomCode] = useState("");

  const createRoom = async () => {
    const room = await addDoc(collection(db, "rooms"), {
      host: auth.currentUser?.uid,
      state: "waiting",
      players: [{ uid: auth.currentUser?.uid, score: 0 }],
    });
    setRoomCode(room.id);
  };

  const joinRoom = (roomId: string) => {
    setRoomCode(roomId);
  };

  return (
    <div>
      <button onClick={createRoom}>Create Game Room</button>
      <input
        type="text"
        placeholder="Enter Room Code"
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button onClick={() => joinRoom(roomCode)}>Join Game Room</button>
    </div>
  );
};

export default GameLobby;
