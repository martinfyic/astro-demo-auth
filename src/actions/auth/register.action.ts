import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError,
} from 'firebase/auth';
import { firebase } from '@/firebase/config';

export const registerUser = defineAction({
  accept: 'form',
  input: z
    .object({
      name: z.string().min(3).max(105),
      email: z.string().email(),
      password: z.string().min(6).max(15),
      password_confirmation: z.string().min(6).max(15),
      remember_me: z.boolean().default(false),
    })
    .refine(data => data.password === data.password_confirmation, {
      message: 'Passwords do not match',
      path: ['password_confirmation'],
    }),
  handler: async (
    { email, name, password, password_confirmation, remember_me },
    context,
  ) => {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

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

    // Crear usuario
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );

      if (!firebase.auth.currentUser) {
        throw new Error('Something went wrong, please try again later.');
      }

      // Actualizar nombre (displayName)
      updateProfile(firebase.auth.currentUser, {
        displayName: name,
      });

      // Verificar email
      await sendEmailVerification(firebase.auth.currentUser, {
        url: `${import.meta.env.PUBLIC_WEBSITE_URL}/protected?emailVerified=true`,
      });

      // No se puede hacer el return directo del user ya que nos da error en el front.
      return {
        ok: true,
        msg: 'User registered successfully',
        user: {
          uid: user.user.uid,
          email: user.user.email,
          name,
        },
      };
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }

      throw new Error('Something went wrong, please try again later.');
    }
  },
});
