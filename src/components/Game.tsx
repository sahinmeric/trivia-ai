import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Container, Typography, Button, Box } from "@mui/material";

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

const Game: React.FC = () => {
  const { roomId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<string>("waiting");
  const [players, setPlayers] = useState<Player[]>([]);

  // Fetch the authenticated user's UID using onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle the end of a question, wrapped in useCallback
  const handleEndOfQuestion = useCallback(async () => {
    setIsAnswerLocked(true);
    setShowAnswers(true);

    setTimeout(async () => {
      if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
        const newIndex = currentQuestionIndex + 1;

        await updateDoc(doc(db, "rooms", roomId!), {
          currentQuestion: newIndex,
          timer: 10,
        });

        setCurrentQuestionIndex(newIndex);
        setQuestion(questions[newIndex]);
        setTimer(10);
        setSelectedAnswer(null);
        setIsAnswerLocked(false);
        setShowAnswers(false);
      } else {
        await updateDoc(doc(db, "rooms", roomId!), {
          state: "finished",
        });
        setGameState("finished");
      }
    }, 3000);
  }, [currentQuestionIndex, questions, roomId]);

  // Fetch room and question data from Firestore
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setGameState(roomData.state);
        setPlayers(roomData.players || []);

        if (roomData.state === "finished") {
          setQuestion(null);
          return;
        }

        if (Array.isArray(roomData.questions)) {
          setQuestions(roomData.questions);
          setCurrentQuestionIndex(roomData.currentQuestion ?? 0);

          const questionIndex = roomData.currentQuestion ?? 0;
          if (roomData.questions[questionIndex]) {
            setQuestion(roomData.questions[questionIndex]);
          } else {
            setQuestion(null);
          }
        }

        setTimer(roomData.timer ?? 10);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // Countdown Timer Effect
  useEffect(() => {
    if (timer > 0 && !isAnswerLocked) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleEndOfQuestion();
    }
  }, [timer, isAnswerLocked, handleEndOfQuestion]);

  // Handle player's answer and update score
  const handleAnswer = async (answer: string) => {
    if (!roomId || selectedAnswer || isAnswerLocked || !userId) return;

    setSelectedAnswer(answer);

    const isCorrect = answer === question?.correctAnswer;
    const score = isCorrect ? timer * 10 : 0;

    const roomRef = doc(db, "rooms", roomId);
    const updatedPlayers = players.map((player) =>
      player.uid === userId
        ? { ...player, score: player.score + score }
        : player
    );

    await updateDoc(roomRef, {
      [`answers.${userId}`]: { answer, timestamp: timer },
      players: updatedPlayers,
    });
  };

  if (gameState === "finished") {
    return (
      <Container maxWidth="md">
        <Typography variant="h4">Game Over</Typography>
        <Typography variant="h6">Final Scores:</Typography>
        <Box sx={{ mt: 4 }}>
          {players.map((player, index) => (
            <Typography key={index}>
              {player.name}: {player.score} points
            </Typography>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {question ? (
        <Box>
          <Typography variant="h4">{question.question}</Typography>
          <Box sx={{ mt: 4 }}>
            {question.options.map((option: string, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null || isAnswerLocked}
                sx={{ m: 2 }}
                color={
                  showAnswers && option === question.correctAnswer
                    ? "success"
                    : "primary"
                }
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="h6">Loading question...</Typography>
      )}
      <Typography variant="h6">Time left: {timer} seconds</Typography>
    </Container>
  );
};

export default Game;
