import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import type { NextPage } from 'next'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import { CartItemType, ProductType } from '../utils/types'
import Product from '../models/Product'
import db from '../utils/db'
import { Store } from '../utils/Store'

const Home: NextPage<{ products: ProductType[] }> = ({ products }) => {
 const { state, dispatch } = useContext(Store)
 const { cart } = state

 const addToCartHandler = async (product: ProductType) => {
  const existItem = cart.cartItems.find(
   (x: CartItemType) => x.slug === product.slug
  )
  const quantity = existItem ? existItem.quantity + 1 : 1
  const { data } = await axios.get(`/api/products/${product._id}`)

  if (data.countInStock < quantity) {
   return toast.error('Sorry. Product is out of stock')
  }
  dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })

  toast.success('Product added to the cart')
 }
 return (
  <Layout title="Home Page">
   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {products.map((product: ProductType) => (
     <ProductItem
      product={product}
      key={product.slug}
      addToCartHandler={addToCartHandler}
     />
    ))}
   </div>
  </Layout>
 )
}

export async function getServerSideProps() {
 await db.connect()
 const products = await Product.find().lean()
 return {
  props: {
   products: products.map(db.convertDocToObj),
  },
 }
}

export default Home
