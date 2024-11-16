import React from "react";
import { Container, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import LobbyControls from "./LobbyControls";
import PlayerList from "./PlayerList";
import StartGameButton from "./StartGameButton";
import LogoutButton from "./LogoutButton";
import RoomCode from "./RoomCode";
import usePlayers from "../hooks/usePlayers";
import useRoomOwner from "../hooks/useRoomOwner";
import useRoomActions from "../hooks/useRoomActions";

const GameLobby: React.FC = () => {
  const { roomId } = useParams();
  const { players, ownerId } = usePlayers(roomId);
  const isOwner = useRoomOwner(roomId);
  const { createRoom, joinRoom, error } = useRoomActions();

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
            <StartGameButton
              isOwner={isOwner}
              playerCount={players.length}
              onStart={() => {}}
            />
          </>
        )}
        <LogoutButton />
      </Box>
    </Container>
  );
};

export default GameLobby;
