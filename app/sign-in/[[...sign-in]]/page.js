import { SignIn } from "@clerk/nextjs";
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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
      >
        <Typography variant="h4" padding={6}>Sign In</Typography>
        <SignIn />
      </Box>

  );
}
