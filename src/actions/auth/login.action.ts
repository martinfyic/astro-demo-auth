import { firebase } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(15),
    remember_me: z.boolean().default(false),
  }),
  handler: async ({ email, password, remember_me }, context) => {
    // Cookies
    if (remember_me) {
      context.cookies.set('email', email, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: '/',
      });
    } else {
      context.cookies.delete('email', {
        path: '/',
      });
    }

    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );
      return {
        ok: true,
        msg: 'User logged in successfully',
        user: {
          uid: user.user.uid,
          email: user.user.email,
          name: user.user.displayName,
        },
      };
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }

      throw new Error('Something went wrong, please try again later.');
    }
  },
});
