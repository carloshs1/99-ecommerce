import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from '../utils/Store'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

const MyApp = ({
 Component,
 pageProps: { session, ...pageProps },
}: AppProps<{
 session: Session
}>) => {
 return (
  <SessionProvider session={session}>
   <StoreProvider>
    <Component {...pageProps} />
   </StoreProvider>
  </SessionProvider>
 )
}

export default MyApp
