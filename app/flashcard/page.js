'use client';

import {useUser} from '@clerk/next.js';
import { useEffect, useState} from 'react';
import {collection, doc, getDoc, getDocs } from 'firebase/firestore';
import {db} from '@/firebase'

import { useSearchParams } from 'next/navigation';

export default function FlashCard() {
    const { isLoaded, isSignedin, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!user) return 
            const docRef = collection(doc(collection(db,'users'), user.id), search)
            const docs = await getDocs(docRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)

        }
        getFlashcard() 
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };
    
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth='100vw'>
            <Grid container spacing={3} sx={{mt: 4}}>
                    
            </Grid>
        </Container>
    )


}