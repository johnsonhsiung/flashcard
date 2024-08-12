import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { Button, Toolbar, Typography, Container, AppBar } from "@mui/material";
import Head from "next/head"


export default function Home() {
    
  return <Container maxwidth='100%'>
    <Head>
      <title>
        Flashcard 
      </title>
      <meta name='descrption' content="Create flashcards from your text" />
    </Head>
    <AppBar position ='static'>
      <Toolbar>
        <Typography variant='h6' style= {{flexgrow: 1 }}>
          Flashcard SaaS
        </Typography>
        <SignedOut>
          <Button color='inherit'>Login</Button>
          <Button color='inherit'>Sign Up</Button>
        </SignedOut>
        <SignedIn> 
          <UserButton/> 
        </SignedIn>
      </Toolbar>
    </AppBar>
  </Container>


}
