import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import LobbyControls from "./LobbyControls";
import PlayerList from "./PlayerList";
import StartGameButton from "./StartGameButton";
import LogoutButton from "./LogoutButton";
import RoomCode from "./RoomCode";
import usePlayers from "../hooks/usePlayers";
import useRoomOwner from "../hooks/useRoomOwner";
import useRoomActions from "../hooks/useRoomActions";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const GameLobby: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { players, ownerId } = usePlayers(roomId);
  const isOwner = useRoomOwner(roomId);
  const { createRoom, joinRoom, startGame, error } = useRoomActions();

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        if (roomData.state === "in-progress") {
          navigate(`/game/${roomId}`);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  return (
    <Container maxWidth="xs">
      <Box>
        {!roomId ? (
          <LobbyControls
            createRoom={createRoom}
            joinRoom={joinRoom}
            error={error}
          />
        ) : (
          <>
            {roomId && <RoomCode roomId={roomId} />}
            <PlayerList players={players} ownerId={ownerId} />
            {isOwner && (
              <StartGameButton
                isOwner={isOwner}
                roomId={roomId}
                playerCount={players.length}
                onStart={startGame}
              />
            )}
          </>
        )}
        <LogoutButton />
      </Box>
    </Container>
  );
};

export default GameLobby;
