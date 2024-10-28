import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Box, Button, TextField, Typography, Container } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      setError("");
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
      console.error("Error with Authentication:", error);
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
          {isSignUp ? "Sign Up" : "Log In"}
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAuth}
          sx={{ mt: 2 }}
        >
          {isSignUp ? "Sign Up" : "Log In"}
        </Button>

        <Button
          variant="text"
          onClick={() => setIsSignUp(!isSignUp)}
          sx={{ mt: 1 }}
        >
          {isSignUp ? "Already have an account? Log In" : "No account? Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
