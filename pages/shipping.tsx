import React, { useContext, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import { ShippingFormValues } from '../utils/types'

const ShippingScreen = () => {
 const {
  handleSubmit,
  register,
  formState: { errors },
  setValue,
 } = useForm<ShippingFormValues>()

 const { state, dispatch } = useContext(Store)
 const { cart } = state
 const { shippingAddress } = cart
 const router = useRouter()

 useEffect(() => {
  setValue('fullName', shippingAddress.fullName)
  setValue('address', shippingAddress.address)
  setValue('neighborhood', shippingAddress.neighborhood)
  setValue('exNumber', shippingAddress.exNumber)
  setValue('inNumber', shippingAddress.inNumber)
  setValue('postalCode', shippingAddress.postalCode)
  setValue('phoneNumber', shippingAddress.phoneNumber)
  setValue('city', shippingAddress.city)
  setValue('state', shippingAddress.state)
 }, [setValue, shippingAddress])

 const submitHandler: SubmitHandler<FieldValues> = ({
  fullName,
  address,
  city,
  postalCode,
  state,
  neighborhood,
  exNumber,
  inNumber,
  phoneNumber,
 }) => {
  dispatch({
   type: 'SAVE_SHIPPING_ADDRESS',
   payload: {
    fullName,
    address,
    city,
    postalCode,
    state,
    neighborhood,
    exNumber,
    inNumber,
    phoneNumber,
   },
  })
  Cookies.set(
   'cart',
   JSON.stringify({
    ...cart,
    shippingAddress: {
     fullName,
     address,
     city,
     postalCode,
     state,
     neighborhood,
     exNumber,
     inNumber,
     phoneNumber,
    },
   })
  )
  router.push('/payment')
 }

 return (
  <Layout title="Shipping Address">
   <>
    <CheckoutWizard activeStep={1} />
    <form
     className="mx-auto max-w-screen-md"
     onSubmit={handleSubmit(submitHandler)}
    >
     <h1 className="mb-4 text-xl">Shipping Address</h1>
     <div className="mb-4">
      <label htmlFor="fullName">Full Name</label>
      <input
       className="w-full"
       id="fullName"
       autoFocus
       {...register('fullName', {
        required: 'Please enter full name',
       })}
      />
      {errors.fullName && (
       <div className="text-red-500">{errors.fullName.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="address">Address</label>
      <input
       className="w-full"
       id="address"
       {...register('address', {
        required: 'Please enter address',
        minLength: { value: 3, message: 'Address is more than 2 chars' },
       })}
      />
      {errors.address && (
       <div className="text-red-500">{errors.address.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="neighborhood">Neighborhood</label>
      <input
       className="w-full"
       id="neighborhood"
       {...register('neighborhood', {
        required: 'Please enter neighborhood',
        minLength: { value: 3, message: 'neighborhood is more than 2 chars' },
       })}
      />
      {errors.neighborhood && (
       <div className="text-red-500">{errors.neighborhood.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="exNumber">Exterior Number</label>
      <input
       className="w-full"
       id="exNumber"
       {...register('exNumber', {
        required: 'Please enter Exterior Number',
        minLength: {
         value: 3,
         message: 'Exterior Number is more than 2 chars',
        },
       })}
      />
      {errors.exNumber && (
       <div className="text-red-500">{errors.exNumber.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="inNumber">Interior Number</label>
      <input className="w-full" id="inNumber" {...register('inNumber')} />
     </div>
     <div className="mb-4">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
       className="w-full"
       id="phoneNumber"
       {...register('phoneNumber', {
        required: 'Please enter Phone Number',
        minLength: {
         value: 10,
         message: 'Exterior Number is more than 9 chars',
        },
       })}
      />
      {errors.phoneNumber && (
       <div className="text-red-500 ">{errors.phoneNumber.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="postalCode">Postal Code</label>
      <input
       className="w-full"
       id="postalCode"
       {...register('postalCode', {
        required: 'Please enter postal code',
       })}
      />
      {errors.postalCode && (
       <div className="text-red-500 ">{errors.postalCode.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="city">City</label>
      <input
       className="w-full"
       id="city"
       {...register('city', {
        required: 'Please enter city',
       })}
      />
      {errors.city && (
       <div className="text-red-500 ">{errors.city.message}</div>
      )}
     </div>
     <div className="mb-4">
      <label htmlFor="state">state</label>
      <input
       className="w-full"
       id="state"
       {...register('state', {
        required: 'Please enter state',
       })}
      />
      {errors.state && (
       <div className="text-red-500 ">{errors.state.message}</div>
      )}
     </div>
     <div className="mb-4 flex justify-between">
      <button className="primary-button">Next</button>
     </div>
    </form>
   </>
  </Layout>
 )
}

ShippingScreen.auth = true

export default ShippingScreen
