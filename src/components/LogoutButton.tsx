import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Tooltip title="Logout">
      <IconButton
        color="error"
        onClick={handleLogout}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
