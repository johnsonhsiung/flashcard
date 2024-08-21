"use client";

import { Button, Typography, Container, Box, Grid, Paper } from "@mui/material";
import Link from "next/link";
import getStripe from "@/utils/get-stripe";

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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" fontWeight="700" color="primary" gutterBottom>
          Welcome to FlashBrain
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          The easiest way to make flashcards from text!
        </Typography>
        <Link href="generate" passHref>
          {" "}
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="600">
              Smart Flashcards
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Our AI intelligently generates flashcards with a simple prompt!
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="600">
              Accessible Anywhere
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Study on the go and be ready for any exam!
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="600">
              Easy Text Input
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Simply input your text and let our software do the rest!
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={8} mb={4}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Pricing
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Choose a plan that suits your needs
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h5" fontWeight="600">
              Basic
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Free
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Access to flashcard features and limited storage
            </Typography>
            <Button
              variant="contained"
              sx={{backgroundColor: 'gray'}}
              color='secondary'
            >
              Default
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h5" fontWeight="600">
              Pro
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              $10 / month
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Access to unlimited flashcard features and storage
            </Typography>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
            >
              Select
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
