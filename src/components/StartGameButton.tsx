import React from "react";
import { Button } from "@mui/material";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

interface StartGameButtonProps {
  isOwner: boolean;
  roomId: string;
  playerCount: number;
  onStart: (roomId: string) => Promise<void>;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({
  isOwner,
  roomId,
  playerCount,
  onStart,
}) => {
  const handleStartGame = async () => {
    if (!roomId || !isOwner || playerCount < 2) return;
    await onStart(roomId);
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        state: "in-progress",
        currentQuestion: 0,
        timer: 10,
      });
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="success"
      onClick={handleStartGame}
      disabled={!isOwner || playerCount < 2}
      sx={{ mt: 4 }}
    >
      Start Game
    </Button>
  );
};

export default StartGameButton;
