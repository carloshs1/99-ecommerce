/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import { ProductType } from '../utils/types'

const ProductItem = ({
 product,
 addToCartHandler,
}: {
 product: ProductType
 addToCartHandler: any
}) => {
 return (
  <div className="card">
   <Link href={`/product/${product.slug}`}>
    <a>
     <div className="image-container">
      <img
       src={product.image}
       alt={product.name}
       className="rounded shadow image-size"
      />
     </div>
    </a>
   </Link>
   <div className="flex flex-col items-center justify-center p-5">
    <Link href={`/product/${product.slug}`}>
     <a>
      <h2 className="text-lg">{product.name}</h2>
     </a>
    </Link>
    <p className="mb-2">{product.brand}</p>
    <p>${product.price}</p>
    <button
     className="primary-button"
     type="button"
     onClick={() => addToCartHandler(product)}
    >
     Add to cart
    </button>
   </div>
  </div>
 )
}

export default ProductItem
