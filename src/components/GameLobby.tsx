import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GameLobby: React.FC = () => {
  const [roomCode, setRoomCode] = useState("");
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Create a new room
  const createRoom = async () => {
    setError("");
    try {
      const roomRef = await addDoc(collection(db, "rooms"), {
        host: auth.currentUser?.uid,
        state: "waiting",
        players: [{ uid: auth.currentUser?.uid, score: 0 }],
      });
      setCreatedRoomCode(roomRef.id);
    } catch (error) {
      setError("Failed to create room. Please try again.");
      console.error("Error creating room:", error);
    }
  };

  // Join an existing room by room code
  const joinRoom = async () => {
    setError("");
    try {
      const roomRef = doc(db, "rooms", roomCode);
      await updateDoc(roomRef, {
        players: arrayUnion({ uid: auth.currentUser?.uid, score: 0 }),
      });
    } catch (error) {
      setError("Failed to join room. Please check the code and try again.");
      console.error("Error joining room:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h5" gutterBottom>
          Game Lobby
        </Typography>

        {createdRoomCode ? (
          <Typography variant="body1">
            Room created! Share this code with others to join:{" "}
            <strong>{createdRoomCode}</strong>
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createRoom}
            sx={{ mt: 2 }}
          >
            Create Game Room
          </Button>
        )}

        <TextField
          label="Enter Room Code"
          variant="outlined"
          margin="normal"
          fullWidth
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={joinRoom}
          sx={{ mt: 2 }}
        >
          Join Game Room
        </Button>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default GameLobby;
