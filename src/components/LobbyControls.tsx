import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

interface LobbyControlsProps {
  createRoom: () => Promise<void>;
  joinRoom: (code: string) => Promise<void>;
  error: string | null;
}

const LobbyControls: React.FC<LobbyControlsProps> = ({
  createRoom,
  joinRoom,
  error,
}) => {
  const [roomCode, setRoomCode] = useState("");

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button
        variant="contained"
        color="primary"
        onClick={createRoom}
        fullWidth
        sx={{ mb: 2 }}
      >
        Create Game Room
      </Button>
      <TextField
        label="Enter Room Code"
        fullWidth
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => joinRoom(roomCode)}
        fullWidth
      >
        Join Game Room
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LobbyControls;
