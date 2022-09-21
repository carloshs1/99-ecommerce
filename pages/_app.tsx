import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { CustomAppProps } from '../utils/types'
import 'react-toastify/dist/ReactToastify.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const Auth = ({ children }: { children: any }) => {
 const router = useRouter()
 const { status } = useSession({
  required: true,
  onUnauthenticated() {
   router.push('/unauthorized?message=login required')
  },
 })
 if (status === 'loading') {
  return <div>Loading...</div>
 }

 return children
}

const MyApp = ({
 Component,
 pageProps: { session, ...pageProps },
}: CustomAppProps) => {
 return (
  <SessionProvider session={session}>
   <StoreProvider>
    <PayPalScriptProvider
     deferLoading={true}
     options={{ 'client-id': process.env.PAYPAL_CLIENT_ID! }}
    >
     {Component.auth ? (
      <Auth>
       <Component {...pageProps} />
      </Auth>
     ) : (
      <Component {...pageProps} />
     )}
    </PayPalScriptProvider>
   </StoreProvider>
  </SessionProvider>
 )
}

export default MyApp
