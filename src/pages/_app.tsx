// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import React from 'react';
function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
