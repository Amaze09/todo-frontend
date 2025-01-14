import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace this with your actual authentication logic
        if (
          credentials?.username === 'admin' &&
          credentials?.password === 'password'
        ) {
          // Return a user object with 'id' as a string
          return {
            id: '1', // Make sure 'id' is a string
            name: 'Admin',
          }
        }
        return null // Return null if credentials are invalid
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: 'jwt', // Use JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token) { // Ensure session.user and token are defined
        session.user.id = (token.id as string) // Type assertion to 'string'
        session.user.name = token.name as string // Type assertion to 'string'
      }
      return session
    },
  },
})
