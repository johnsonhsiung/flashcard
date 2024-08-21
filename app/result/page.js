"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { useSearchParams } from "next/navigation";
import {
  CircularProgress,
  Container,
  Typography,
  Box,
  Grow,
} from "@mui/material";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import Icon from "@mui/material/Icon";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [hidden, setHidden] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(
          `/api/checkout_session?session_id=${session_id}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occured");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 50 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="100vw"
      display="flex"
      sx={{
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        mt: 20,
      }}
    >
      {session.payment_status === "paid" ? (
        <>
          <Grow in={true}>
            <Typography sx={{ transitionDelay: "2s" }} variant="h4">
              {" "}
              Thank you for purchasing!
            </Typography>
          </Grow>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={5000}
          />

          <Box sx={{ mt: 4 }}>
            <Grow
              in={true}
              style={{ transformOrigin: "0 5 0" }}
              {...(true ? { timeout: 5000 } : {})}
            >
              <Typography variant="h1">✅</Typography>
            </Grow>
            <Grow
              in={true}
              style={{ transformOrigin: "0 5 0" }}
              {...(true ? { timeout: 6000 } : {})}
            >
              <Typography variant="h6" italics>
                {" "}
                We have received your payment. Stand by for an email with your
                receipt. Thanks for your support!
                <Typography variant="body1">
                  Session ID: {session_id}
                </Typography>
              </Typography>
            </Grow>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4"> Payment Failed</Typography>
          <Box sx={{ mt: 4 }}>
            <Grow
              in={true}
              style={{ transformOrigin: "0 5 0" }}
              {...(true ? { timeout: 5000 } : {})}
            >
              <Typography variant="h1">❌</Typography>
            </Grow>
            <Grow
              in={true}
              style={{ transformOrigin: "0 5 0" }}
              {...(true ? { timeout: 6000 } : {})}
            >
              <Typography variant="h6">
                Your payment was not successful
                <Typography variant="body1">
                  Session ID: {session_id}
                </Typography>
              </Typography>
            </Grow>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
