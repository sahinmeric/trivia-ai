import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Typography, Button, Box } from "@mui/material";
import useAuthListener from "../hooks/useAuthListener";
import { useRoomData } from "../hooks/useRoomData";
import { useTimer } from "../hooks/useTimer";

const Game: React.FC = () => {
  const { roomId } = useParams();
  const user = useAuthListener();
  const userId = user?.uid;
  const { questions, currentQuestionIndex, question, players, gameState } =
    useRoomData(roomId);

  const { timer: countdown, resetTimer } = useTimer(10, () =>
    handleEndOfQuestion()
  );

  const handleEndOfQuestion = useCallback(async () => {
    if (!roomId) return;

    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        console.error("Room does not exist");
        return;
      }

      const roomData = roomSnap.data();

      if (!roomData) {
        console.error("Room data is undefined");
        return;
      }

      if (roomData.state !== "in-progress") {
        console.log("Game is not in progress, exiting");
        return;
      }

      if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
        const newIndex = currentQuestionIndex + 1;
        await updateDoc(roomRef, {
          currentQuestion: newIndex,
          timer: 10,
          answers: {},
        });

        resetTimer();
      } else {
        await updateDoc(roomRef, {
          state: "finished",
        });
      }
    } catch (error) {
      console.error("Error in handleEndOfQuestion:", error);
    }
  }, [currentQuestionIndex, questions, roomId, resetTimer]);

  const handleAnswer = async (answer: string) => {
    if (!roomId || !userId) return;

    const isCorrect = answer === question?.correctAnswer;
    const score = isCorrect ? countdown * 10 : 0;

    const roomRef = doc(db, "rooms", roomId);
    const updatedPlayers = players.map((player) =>
      player.uid === userId
        ? { ...player, score: player.score + score }
        : player
    );

    await updateDoc(roomRef, {
      [`answers.${userId}`]: { answer, timestamp: countdown },
      players: updatedPlayers,
    });
  };

  if (gameState === "finished") {
    return (
      <Container maxWidth="md">
        <Typography variant="h4">Game Over</Typography>
        <Typography variant="h6">Final Scores:</Typography>
        {players.map((player, index) => (
          <Typography key={index}>
            {player.name}: {player.score} points
          </Typography>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {question && (
        <Box>
          <Typography variant="h4">{question.question}</Typography>
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={countdown === 0}
              sx={{ m: 2 }}
            >
              {option}
            </Button>
          ))}
          <Typography variant="h6">Time left: {countdown} seconds</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Game;
