import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Store } from '../utils/Store'
import { CartItemType } from '../utils/types'

const Layout = ({
 title,
 children,
}: {
 title: string
 children: JSX.Element
}) => {
 const { status, data: session } = useSession()
 const { state } = useContext(Store)
 const { cart } = state
 const [cartItemsCount, setCartItemsCount] = useState(0)
 useEffect(() => {
  setCartItemsCount(
   cart.cartItems.reduce((a: number, c: CartItemType) => a + c.quantity, 0)
  )
 }, [cart.cartItems])
 return (
  <>
   <Head>
    <title>{title ? title + ' - 99 Ecommerce' : '99 Ecommerce'}</title>
    <meta name="description" content="Ecommerce Website" />
    <link rel="icon" href="/favicon.ico" />
   </Head>

   <ToastContainer position="bottom-center" limit={1} />

   <div className="flex min-h-screen flex-col justify-between ">
    <header>
     <nav className="flex h-12 items-center px-4 justify-between shadow-md">
      <Link href="/">
       <a className="text-lg font-bold">99 Ecommerce</a>
      </Link>
      <div>
       <Link href="/cart">
        <a className="p-2">
         Cart
         {cartItemsCount > 0 && (
          <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
           {cartItemsCount}
          </span>
         )}
        </a>
       </Link>
       {status === 'loading' ? (
        'Loading'
       ) : session?.user ? (
        session.user.name
       ) : (
        <Link href="/login">
         <a className="p-2">Login</a>
        </Link>
       )}
      </div>
     </nav>
    </header>
    <main className="container m-auto mt-4 px-4">{children}</main>
    <footer className="flex h-10 justify-center items-center shadow-inner">
     <p>Copyright © 2022 99 Ecommerce</p>
    </footer>
   </div>
  </>
 )
}

export default Layout
