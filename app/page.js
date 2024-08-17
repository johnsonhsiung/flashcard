"use client";

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Button,
  Toolbar,
  Typography,
  Container,
  AppBar,
  Box,
  Grid,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard</title>
        <meta name="descrption" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link style={{ textDecoration: "none", color: "white" }} href="#">
              Flashcards SaaS
            </Link>
          </Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in">
              Login
            </Button>
            <Button color="inherit" href="sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" gutterBottom>
          The easiest way to make flashcards from text
        </Typography>
        <Link href="generate" passHref>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Get Started
          </Button>
        </Link>

        <Grid container spaching={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Smart Flashcards
            </Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise
              flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Accessible anywhere
            </Typography>
            <Typography> Study on the go and be ready for any exam!</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Easy Text Input
            </Typography>
            <Typography>
              Simply input your text and let our software do the rest!
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={4} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                {" "}
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / month
                </Typography>
                <Typography gutterBottom>
                  Access to flashcard features and limited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Select
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                {" "}
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / month
                </Typography>
                <Typography gutterBottom>
                  Access to unlimited flashcard features and storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Select
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
