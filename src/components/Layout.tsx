import React from "react";
import LogoutButton from "./LogoutButton";
import { Box } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      <LogoutButton />
      {children}
    </Box>
  );
};

export default Layout;
