import {
    Button,
    Toolbar,
    Typography,
    Container,
    AppBar,
    Box,
    Grid,
  } from "@mui/material";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HeaderBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    <Link style={{ textDecoration: "none", color: "white", marginLeft: "64px" }} href="/">
                    FlashBrain
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
                    <Link style={{ textDecoration: "none", color: "white", marginRight: "32px" }} href="/generate">Generate</Link>
                    <Link style={{ textDecoration: "none", color: "white", marginRight: "32px"}} href="/flashcards">
                        Saved 
                    </Link>
                    <Box sx={{ marginRight: "64px", display: "flex", alignItems: "center"}  }>
                        <UserButton />
                    </Box>
                </SignedIn>
            </Toolbar>
    </AppBar>
)

}
