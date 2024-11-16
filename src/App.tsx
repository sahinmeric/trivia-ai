import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Login from "./components/Login";
import GameLobby from "./components/GameLobby";
import Game from "./components/Game";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/lobby" /> : <Login />} />
      <Route
        path="/lobby"
        element={user ? <GameLobby /> : <Navigate to="/" />}
      />
      <Route
        path="/lobby/:roomId"
        element={user ? <GameLobby /> : <Navigate to="/" />}
      />
      <Route
        path="/game/:roomId"
        element={user ? <Game /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
