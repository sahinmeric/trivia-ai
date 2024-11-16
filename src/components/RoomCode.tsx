import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface RoomCodeProps {
  roomId: string;
}

const RoomCode: React.FC<RoomCodeProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 3 }}
    >
      <Typography variant="body1" sx={{ mr: 1 }}>
        Room Code: <strong>{roomId}</strong>
      </Typography>
      <CopyToClipboard text={roomId} onCopy={handleCopy}>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <IconButton color="primary">
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
    </Box>
  );
};

export default RoomCode;
