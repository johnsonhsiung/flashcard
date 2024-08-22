"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import LinearIndeterminate from "@/components/LinearIndeterminate";
import { useTheme } from '@mui/material/styles';

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
import Snackbar from '@mui/material/Snackbar';
import Link from "next/link";


export default function Generate() {
  const { isLoaded, isSignedin, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [promptError, setPromptError] = useState(false);
  const [collectionNameError, setCollectionNameError] = useState(false);
  const [signedInError, setSignedInError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emptyFlashcardsError, setEmptyFlashcardsError] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sameNameError, setSameNameError] = useState(false);


  const router = useRouter();
  const theme = useTheme();


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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setEmptyFlashcardsError(true); 
          console.log('empty flashcard')
        } else {
          setFlashcards(data);
          setEmptyFlashcardsError(false)
        }
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
  const handleSuccessOpen = () => {
    setSuccessOpen(true);
  };
  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };
  const handleSameNameOpen = () => {
    setSameNameError(true);
  }
  const handleSameNameClose = () => {
    setSameNameError(false);
  }

  
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
        handleSameNameOpen()
        return; 
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
    handleSuccessOpen();    
    //router.push("/flashcards");
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
              if (promptError) setPromptError(false);
              if (emptyFlashcardsError) setEmptyFlashcardsError(false);
              setText(e.target.value);
            }}
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
          {emptyFlashcardsError && (
            <Alert severity='error' sx={{mb: 2}}>Error generating flashcards. Please make sure the prompt is clear.</Alert>
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
                <Card sx={{backgroundColor: theme.palette.primary.main}}>
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
                            backgroundColor: '#FAFAFA',
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
            <Button variant="contained" colors="secondary" onClick={handleOpen}>
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
              if (sameNameError) handleSameNameClose()
              if (collectionNameError) setCollectionNameError(false)
              setName(e.target.value);}}
            variant="outlined"
          ></TextField>
          {sameNameError && (
            <Alert severity="error">Duplicate name. Please choose a different name.</Alert>
          )

          }
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
      <Snackbar open={successOpen} autoHideDuration={10000} onClose={handleSuccessClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Flashcard collection saved! Navigate to&nbsp;  
          <Typography component='span' sx={{color:'white'}}>
            <Link href='/flashcards' sx={{            
              textDecoration: 'underline',
            }}>
              Saved
            </Link>

          </Typography>

          &nbsp;to view it. 
        </Alert>
      </Snackbar>
    </Container>
  );
}
