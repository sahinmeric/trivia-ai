import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import { Person as PersonIcon, Star as StarIcon } from "@mui/icons-material";

interface PlayerListProps {
  players: { uid: string; name: string }[];
  ownerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, ownerId }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Players in the Room
      </Typography>
      {players.map((player, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", mb: 2, p: 1 }}
        >
          <Avatar
            sx={{
              bgcolor:
                ownerId === player.uid ? "primary.main" : "secondary.main",
              mr: 2,
            }}
          >
            <PersonIcon />
          </Avatar>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <Typography variant="body1">{player.name}</Typography>
            {ownerId === player.uid && (
              <Chip
                label="Owner"
                icon={<StarIcon />}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PlayerList;
