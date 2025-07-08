import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface MyUser {
  id: string
  prenom: string
  nom: string
  roles?: string | string[]
  token: string
  sexe?: string
  telephone?: string
  image?: string
  createdAt?: string
  updatedAt?: string
  email: string
}
type SessionUser = {
  id: string
  email: string
  name: string
  role: string | string[]
  accessToken: string
  firstName: string
  lastName: string
  sexe?: string
  telephone?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'email@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        try {
          const res = await fetch(`${BASE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          console.log('Response status:', res.status)
          const result = await res.json()
          console.log('User response:', result)

          if (!res.ok) {
            throw new Error(result.message || 'Invalid email or password')
          }

          const user = result.data.connected_user
          const accessToken = result.data.access_token

          if (user && accessToken) {
            return {
              ...user,
              token: accessToken,
            }
          }

          return null
        } catch (error) {
          console.error('Authorize error:', error)
          throw new Error('Erreur lors de la connexion: ' + (error as Error).message)
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/auth/sign-in',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const myUser = user as MyUser
        token.id = myUser.id
        token.email = myUser.email
        token.name = `${myUser.prenom} ${myUser.nom}`
        token.role = myUser.roles || 'user'
        token.accessToken = myUser.token
        token.firstName = myUser.prenom
        token.lastName = myUser.nom
        token.sexe = myUser.sexe
        token.telephone = myUser.telephone
        token.image = myUser.image
        token.createdAt = myUser.createdAt
        token.updatedAt = myUser.updatedAt
      }
      return token
    }, // <-- ici
  
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        accessToken: token.accessToken as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        sexe: token.sexe as string,
        telephone: token.telephone as string,
        image: token.image as string,
        createdAt: token.createdAt as string,
        updatedAt: token.updatedAt as string,
      } as SessionUser
      return session
    }
    
  },
  

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 jour
  },

  debug: true,
}

export default NextAuth(options)
