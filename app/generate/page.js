"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import LinearIndeterminate from "@/components/LinearIndeterminate";

import {
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  DialogTitle,
  Grid,
  Card,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";

import Alert from '@mui/material/Alert';


export default function Generate() {
  const { isLoaded, isSignedin, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [promptError, setPromptError] = useState(false);
  const [collectionNameError, setCollectionNameError] = useState(false);
  const [signedInError, setSignedInError] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter();


  const handleSubmit = async () => {
    if (!text.trim()) {
      setPromptError(true)
      return
    }
    setLoading(true)
    fetch("api/generate", {
      method: "POST",
      body: text,
    })
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((data) => {
        setFlashcards(data);
        setLoading(false);
      });
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setCollectionNameError(false)
    setSignedInError(false)
    setOpen(false);
  };

  

  const saveFlashcards = async () => {
    if (!user) {
      setSignedInError(true);
      return;
    }
    const trimmedName = name.trim() 
    if (!trimmedName) {
      setCollectionNameError(true);
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];

      if (collections.find((f) => f.name == trimmedName)) {
        alert("Flashcard collection with the name already exists!");
      } else {
        collections.push({ name: trimmedName });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name: trimmedName }] });
    }

    const colRef = collection(userDocRef, trimmedName);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Generate Flashcards</Typography>

        <Paper sx={{ p: 4, width: "100%" }}>
          <TextField
            value={text}
            onChange={(e) => {
              if (promptError) setPromptError(false)
              setText(e.target.value)}}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          ></TextField>
          {promptError && (
            <Alert severity="error" sx={{mb: 2}}>Please enter a prompt before generating.</Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>
      {loading && (
            <LinearIndeterminate/>
      )}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  >
                    <CardContent>
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
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div1">
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
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button variant="contined" colors="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => {
              if (collectionNameError) setCollectionNameError(false)
              setName(e.target.value)}}
            variant="outlined"
          ></TextField>
          {collectionNameError && (
            <Alert severity="error">Please enter a collection name.</Alert>
          )}
          {signedInError && (
            <Alert severity="error"> Please sign in to save your flashcards.</Alert>
          )}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
