import axios from 'axios'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { toast } from 'react-toastify'
import { getError } from '../../utils/error'

const reducer = (state, action) => {
 switch (action.type) {
  case 'FETCH_REQUEST':
   return { ...state, loading: true, error: '' }
  case 'FETCH_SUCCESS':
   return { ...state, loading: false, order: action.payload, error: '' }
  case 'FETCH_FAIL':
   return { ...state, loading: false, error: action.payload }
  case 'PAY_REQUEST':
   return { ...state, loadingPay: true }
  case 'PAY_SUCCESS':
   return { ...state, loadingPay: true, successPay: true }
  case 'ORDER_DELIVERY_SUCCESS':
   return { ...state, loadingPay: false, successDeliverySchedule: true }
  case 'ORDER_DELIVERY_CANCEL':
   return { ...state, successDeliverySchedule: false }
  case 'PAY_FAIL':
   return { ...state, loadingPay: false, errorPay: action.payload }
  case 'PAY_RESET':
   return { ...state, loadingPay: false, successPay: false, errorPay: '' }
  default:
   state
 }
}
const OrderScreen = () => {
 const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
 const { query } = useRouter()
 const orderId = query.id

 const [{ loading, error, order, successPay, loadingPay }, dispatch] =
  useReducer(reducer, {
   loading: true,
   order: {},
   error: '',
  })
 useEffect(() => {
  const fetchOrder = async () => {
   try {
    dispatch({ type: 'FETCH_REQUEST' })
    const { data } = await axios.get(`/api/orders/${orderId}`)
    dispatch({ type: 'FETCH_SUCCESS', payload: data })
   } catch (err) {
    dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
   }
  }
  if (!order._id || successPay || (order._id && order._id !== orderId)) {
   fetchOrder()
   if (successPay) {
    dispatch({ type: 'PAY_RESET' })
   }
  } else {
   const loadPaypalScript = async () => {
    const { data: clientId } = await axios.get('/api/keys/paypal')
    paypalDispatch({
     type: 'resetOptions',
     value: {
      'client-id': clientId,
      currency: 'USD',
     },
    })
    paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
   }
   loadPaypalScript()
  }
 }, [order, orderId, paypalDispatch, successPay])
 const {
  shippingAddress,
  paymentMethod,
  orderItems,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  isPaid,
  paidAt,
  isDelivered,
  deliveredAt,
 } = order

 const createOrder = (data, actions) => {
  return actions.order
   .create({
    purchase_units: [
     {
      amount: { value: totalPrice },
     },
    ],
   })
   .then((orderID) => {
    return orderID
   })
 }

 const onApprove = (data, actions) => {
  return actions.order.capture().then(async function (details) {
   try {
    dispatch({ type: 'PAY_REQUEST' })
    const { data } = await axios.put(`/api/orders/${order._id}/pay`, details)
    dispatch({ type: 'PAY_SUCCESS', payload: data })
    const { data: dataForDelivery } = await axios.post(
     '/api/orders/delivery/create-order',
     { id: order._id }
    )
    dispatch({ type: 'ORDER_DELIVERY_SUCCESS', payload: dataForDelivery })
    toast.success('Order is paid successfully')
    if (data.deliveryId === '-1')
     toast.error('The delivery was not scheduled. Please contact support')
   } catch (err) {
    dispatch({ type: 'PAY_FAIL', payload: getError(err) })
    toast.error(getError(err))
   }
  })
 }
 const onError = (err) => {
  toast.error(getError(err))
 }

 const cancelDeliveryOrderHandler = async () => {
  try {
   const { data } = await axios.put('/api/orders/delivery/delete-order', {
    id: order._id,
    deliveryId: order.deliveryId,
   })
   dispatch({ type: 'ORDER_DELIVERY_CANCEL', payload: data })
   toast.success('Order delivery was cancel successfully')
  } catch (err) {
   toast.error(getError(err))
  }
 }
 return (
  <Layout title={`Order ${orderId}`}>
   <>
    <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
    {loading ? (
     <div>Loading...</div>
    ) : error ? (
     <div className="alert-error">{error}</div>
    ) : (
     <div className="grid md:grid-cols-4 md:gap-5">
      <div className="overflow-x-auto md:col-span-3">
       <div className="card  p-5">
        <div className="flex flex-row justify-between space-x-4">
         <h2 className="mb-2 text-lg mt-2">Shipping Address</h2>
         {order.deliveryId !== '-1' && (
          <button onClick={cancelDeliveryOrderHandler}>Cancel Delivery</button>
         )}
        </div>
        <div>
         {shippingAddress.fullName}, {shippingAddress.address},{' '}
         {shippingAddress.city}, {shippingAddress.postalCode},{' '}
         {shippingAddress.state}
        </div>
        {isDelivered ? (
         <div className="alert-success">Delivered at {deliveredAt}</div>
        ) : order.deliveryId === '-1' ? (
         order.isPaid ? (
          <div className="alert-error">Delivery Canceled</div>
         ) : (
          <div className="alert-error">Not delivered</div>
         )
        ) : (
         <div className="alert-info">Delivery scheduled</div>
        )}
       </div>

       <div className="card p-5">
        <h2 className="mb-2 text-lg">Payment Method</h2>
        <div>{paymentMethod}</div>
        {isPaid ? (
         <div className="alert-success">Paid at {paidAt}</div>
        ) : (
         <div className="alert-error">Not paid</div>
        )}
       </div>

       <div className="card overflow-x-auto p-5">
        <h2 className="mb-2 text-lg">Order Items</h2>
        <table className="min-w-full">
         <thead className="border-b">
          <tr>
           <th className="px-5 text-left">Item</th>
           <th className="    p-5 text-right">Quantity</th>
           <th className="  p-5 text-right">Price</th>
           <th className="p-5 text-right">Subtotal</th>
          </tr>
         </thead>
         <tbody>
          {orderItems.map((item) => (
           <tr key={item._id} className="border-b">
            <td>
             <Link href={`/product/${item.slug}`}>
              <a className="flex items-center">
               <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
               ></Image>
               &nbsp;
               {item.name}
              </a>
             </Link>
            </td>
            <td className=" p-5 text-right">{item.quantity}</td>
            <td className="p-5 text-right">${item.price}</td>
            <td className="p-5 text-right">${item.quantity * item.price}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </div>
      <div>
       <div className="card  p-5">
        <h2 className="mb-2 text-lg">Order Summary</h2>
        <ul>
         <li>
          <div className="mb-2 flex justify-between">
           <div>Items</div>
           <div>${itemsPrice}</div>
          </div>
         </li>{' '}
         <li>
          <div className="mb-2 flex justify-between">
           <div>Tax</div>
           <div>${taxPrice}</div>
          </div>
         </li>
         <li>
          <div className="mb-2 flex justify-between">
           <div>Shipping</div>
           <div>${shippingPrice}</div>
          </div>
         </li>
         <li>
          <div className="mb-2 flex justify-between">
           <div>Total</div>
           <div>${totalPrice}</div>
          </div>
         </li>
         {!isPaid && (
          <li>
           {isPending ? (
            <div>Loading...</div>
           ) : (
            <div className="w-full">
             <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
             ></PayPalButtons>
            </div>
           )}
           {loadingPay && <div>Loading...</div>}
          </li>
         )}
        </ul>
       </div>
      </div>
     </div>
    )}
   </>
  </Layout>
 )
}

OrderScreen.auth = true
export default OrderScreen
