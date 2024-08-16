"use client";

import {useUser} from '@clerk/nextjs';
import {use, useEffect, useState} from 'react';

import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '@/firebase';
import {useRouter} from 'next/navigation';
import { CardActionArea, Typography } from '@mui/material';

export default function SavedFlashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const {flashcards, setFlashcards} = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return 
            const docRef = doc(collection(db,'users'), user.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [] 
                console.log(collections)
                setFlashcards(collections) 

            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards() 
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        route.push(`/flashcard?id=${id}`)

    }
    return (
    <Container maxWidth='100vw'>
        <Grid
            Container
            spacing={3}
            sx={{
                mt: 4,
            }}
        >
            {flashcards.map((flashcard, index) => {
                <Grid item xs={12} sm={6} md={4} keys={index}>
                    <Card>
                        <CardActionArea onClick={ () => handleCardClick(id)}>

                        </CardActionArea>
                        <CardContent>
                            <Typography variant='h6'>
                                {flashcard.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            }
            )

            }




        </Grid>
    </Container>)


}