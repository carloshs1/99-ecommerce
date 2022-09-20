export type ProductType = {
 slug: string
 image: string
 name: string
 brand: string
 price: number
}

export type CartItemType = {
 slug: string
 image: string
 name: string
 brand: string
 price: number
 quantity: number
 countInStock: number
}

export type LoginFormValues = {
 email: string
 password: string
}
