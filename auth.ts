import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

// Validate required environment variables at startup
const requiredEnvVars = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  BACKEND_URL: process.env.BACKEND_URL,
}

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

// OAuth credentials (optional for now)
const optionalOAuthVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()
          return user
        } catch (error) {
          return null
        }
      }
    }),
    ...(optionalOAuthVars.GOOGLE_CLIENT_ID && optionalOAuthVars.GOOGLE_CLIENT_SECRET ? [Google({
      clientId: optionalOAuthVars.GOOGLE_CLIENT_ID,
      clientSecret: optionalOAuthVars.GOOGLE_CLIENT_SECRET,
    })] : []),
    ...(optionalOAuthVars.GITHUB_CLIENT_ID && optionalOAuthVars.GITHUB_CLIENT_SECRET ? [GitHub({
      clientId: optionalOAuthVars.GITHUB_CLIENT_ID,
      clientSecret: optionalOAuthVars.GITHUB_CLIENT_SECRET,
    })] : []),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/auth/oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account.provider,
              providerId: account.providerAccountId,
            }),
          })

          if (!response.ok) {
            return false
          }

          const userData = await response.json()
          user.id = userData.id
          return true
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }
      return true
    },
  },
  session: {
    strategy: 'jwt',
  },
})