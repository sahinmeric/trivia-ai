import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import GameLobby from "./components/GameLobby";

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
    </Routes>
  );
};

export default App;
