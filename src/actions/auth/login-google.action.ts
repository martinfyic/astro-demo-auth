import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebase } from '@/firebase/config';

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async credentials => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials);

    if (!credential) {
      throw new Error('Failed to obtain Google credentials');
    }

    // Use the credential to sign in with Google
    await signInWithCredential(firebase.auth, credential);

    return { ok: true };
  },
});
