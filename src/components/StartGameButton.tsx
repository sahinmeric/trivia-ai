import React from "react";
import { Button } from "@mui/material";

interface StartGameButtonProps {
  isOwner: boolean;
  playerCount: number;
  onStart: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({
  isOwner,
  playerCount,
  onStart,
}) => {
  if (!isOwner) return null;

  return (
    <Button
      variant="contained"
      color="success"
      fullWidth
      sx={{ mt: 4 }}
      disabled={playerCount < 2}
      onClick={onStart}
    >
      Start Game
    </Button>
  );
};

export default StartGameButton;
