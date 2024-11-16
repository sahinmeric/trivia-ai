import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Player {
  uid: string;
  name: string;
  score: number;
}

export const useRoomData = (roomId: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<string>("waiting");
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setGameState(roomData.state);
        setPlayers(roomData.players || []);

        if (Array.isArray(roomData.questions)) {
          setQuestions(roomData.questions);
          setCurrentQuestionIndex(roomData.currentQuestion ?? 0);
          setQuestion(roomData.questions[roomData.currentQuestion ?? 0]);
        }

        setTimer(roomData.timer ?? 10);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  return {
    questions,
    currentQuestionIndex,
    question,
    players,
    gameState,
    timer,
  };
};
