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
        const res = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const user = await res.json();
        if (res.ok && user) {
          return {
            id: user.id,
            name: user.username,
          }
        }
        return null
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
        session.user.name = token.name as string // Type assertion to 'string'
      }
      return session
    },
  },
})
