import axios from 'axios'
import { NextApiResponse, NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 const session = await getSession({ req })
 if (!session) {
  return res.status(401).send('Error: signin required')
 }
 const { user } = session
 const { data } = await axios.get(
  `https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/orders/${req.body.deliveryId}`,
  {
   headers: {
    'Content-type': 'application/json',
    Authorization: `Basic ${btoa(
     `${user?.email}:${user?.email + req.body.fullName}`
    )}`,
   },
  }
 )
 res.send(data)
}

export default handler
