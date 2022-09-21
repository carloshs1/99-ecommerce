import type { NextComponentType } from 'next'
import { Session } from 'next-auth'
import { AppProps } from 'next/app'

export type ProductType = {
 slug: string
 image: string
 name: string
 brand: string
 price: number
 quantity: number
 countInStock: number
 category: string
 numReviews: number
 rating: number
 description: string
 _id: string
}

export type CartItemType = {
 slug: string
 image: string
 name: string
 brand: string
 price: number
 quantity: number
 countInStock: number
 _id: string
}

export type LoginFormValues = {
 email: string
 password: string
}

export type RegisterFormValues = {
 name: string
 email: string
 password: string
 confirmPassword: string
}

export type CustomAppProps = AppProps<{
 session: Session
}> & {
 Component: NextComponentType & { auth?: boolean }
}

export type ShippingFormValues = {
 fullName: string
 address: string
 city: string
 postalCode: string
 country: string
}

export type OrderType = {
 _id: string
 createdAt: string
 totalPrice: number
 isPaid: any
 paidAt: string
 isDelivered: any
 deliveredAt: string
}
