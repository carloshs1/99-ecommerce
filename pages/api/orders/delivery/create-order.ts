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
  if (order.deliveryId !== '-1') {
   return res
    .status(400)
    .send({ message: 'Error: order is already in delivery stage' })
  }
  const { user } = session
  const {
   fullName,
   address,
   postalCode,
   state,
   city,
   neighborhood,
   exNumber,
   inNumber,
   phoneNumber,
  } = order.shippingAddress
  const { data } = await axios.post(
   'https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/orders/create',
   {
    DestinationAddress: {
     Coordinates: '1.1,1.1',
     FirstName: fullName,
     LastName: fullName.substring(fullName.indexOf(' ') + 1) || '',
     Street: address,
     ZipCode: postalCode,
     State: state,
     City: city,
     Neighborhood: neighborhood,
     ExNumber: exNumber,
     InNumber: inNumber,
     PhoneNumber: phoneNumber,
    },
    Products: [
     ...order.orderItems.map(() => ({
      Weight: 1,
     })), // All objects have a weight of 1 because we only sell clothes in this exercise
    ],
   },
   {
    headers: {
     'Content-type': 'application/json',
     Authorization: `Basic ${btoa(`${user?.email}:${user?.email + fullName}`)}`,
    },
   }
  )
  order.deliveryId = data.Order.ID
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
