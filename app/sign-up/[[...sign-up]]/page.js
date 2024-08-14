import { SignUp } from "@clerk/nextjs";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Link,
  Box,
} from "@mui/material";

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ backgroundColor: "#3F41b5" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link style={{ textDecoration: "none", color: "white" }} href="/">
              Flashcards SaaS
            </Link>
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4">Sign Up</Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
