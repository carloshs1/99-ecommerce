import { getSession } from 'next-auth/react'
import Order from '../../../models/Order'
import db from '../../../utils/db'
import axios from 'axios'

const handler = async (req, res) => {
 const session = await getSession({ req })
 if (!session) {
  return res.status(401).send('signin required')
 }

 const { user } = session
 await db.connect()
 const newOrder = new Order({
  ...req.body,
  user: user._id,
  deliveryId: '-1',
 })

 const order = await newOrder.save()

 const { fullName } = req.body.shippingAddress
 await axios.post(
  'https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/users/create',
  {
   FirstName: fullName,
   LastName: fullName.substring(fullName.indexOf(' ') + 1) || '',
   IsAdmin: true,
   Email: user.email,
   Password: user.email + fullName,
  },
  {
   headers: {
    'Content-type': 'application/json',
   },
  }
 )

 res.status(201).send(order)
}
export default handler
