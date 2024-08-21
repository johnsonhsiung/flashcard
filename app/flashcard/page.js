"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

import {
  CardActionArea,
  CardContent,
  Container,
  Typography,
  Box,
  Grid,
  Card,
} from "@mui/material";

import { useSearchParams } from "next/navigation";

export default function FlashCard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!user || !search) return;
      const docRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(docRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3, // Adds a slight shadow to lift the card off the background
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)", // Slightly enlarges the card on hover
                },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent
                  sx={{
                    padding: 3,
                    backgroundColor: "#f9f9f9", // Light gray background to contrast the white text area
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        WebkitBackfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ color: "#333" }} // Darker text for better contrast
                        >
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="h5"
                          component="div1"
                          sx={{ color: "#333" }} // Darker text for better contrast
                        >
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
