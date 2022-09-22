import axios from 'axios'
import { NextApiResponse, NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 const session = await getSession({ req })
 if (!session) {
  return res.status(401).send('Error: signin required')
 }

 const { user } = session

 const { fullName } = req.body.shippingAddress
 await axios.post(
  'https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/users/create',
  {
   FirstName: fullName,
   LastName: fullName.substring(fullName.indexOf(' ') + 1) || '',
   IsAdmin: true,
   Email: user?.email,
   Password: user?.email + fullName,
  },
  {
   headers: {
    'Content-type': 'application/json',
   },
  }
 )

 res.status(201).send('User for delivery created succesfully')
}

export default handler
