import axios from 'axios'
import { NextApiResponse, NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import Order from '../../../../models/Order'
import db from '../../../../utils/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 const session = await getSession({ req })
 if (!session) {
  return res.status(401).send('Error: signin required')
 }

 await db.connect()
 const order = await Order.findById(req.body.id)
 if (order) {
  if (order.deliveryId === '-1') {
   return res.status(400).send({ message: 'Error: order is already canceled' })
  }
  const { user } = session
  const { fullName } = order.shippingAddress
  await axios.put(
   `https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/orders/${req.body.deliveryId}/cancelado`,
   {},
   {
    headers: {
     'Content-type': 'application/json',
     Authorization: `Basic ${btoa(`${user?.email}:${user?.email + fullName}`)}`,
    },
   }
  )
  order.deliveryId = '-1'
  const orderForDelivery = await order.save()
  await db.disconnect()
  res.send({
   message: 'Order delivery status was updated successfully',
   order: orderForDelivery,
  })
 } else {
  await db.disconnect()
  res.status(404).send({ message: 'Error: order not found' })
 }
}

export default handler
