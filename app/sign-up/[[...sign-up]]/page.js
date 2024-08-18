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
    <Container maxWidth="100vw" height="100vh">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" padding={6}>Sign Up</Typography>
        <SignUp/>
      </Box>
    </Container>
  );
}
