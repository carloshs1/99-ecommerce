import { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from 'bcryptjs'
import User from '../../../models/User'
import db from '../../../utils/db'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
 if (req.method !== 'POST') {
  return
 }
 const { name, email, password } = req.body
 if (
  !name ||
  !email ||
  !email.includes('@') ||
  !password ||
  password.trim().length < 5
 ) {
  res.status(422).json({
   message: 'Validation error',
  })
  return
 }

 await db.connect()

 const existingUser = await User.findOne({ email: email })
 if (existingUser) {
  res.status(422).json({ message: 'User exists already!' })
  await db.disconnect()
  return
 }

 const newUser = new User({
  name,
  email,
  password: bcryptjs.hashSync(password),
  isAdmin: false,
 })

 const user = await newUser.save()
 await db.disconnect()

 const { data } = await axios.post(
  'https://prueba-tecninca-backend-qndxoltwga-uc.a.run.app/users/create',
  {
   FirstName: name,
   LastName: name.substring(name.indexOf(' ') + 1) || '',
   IsAdmin: true,
   Email: email,
   Password: password,
  },
  {
   headers: {
    'Content-type': 'application/json',
   },
  }
 )

 res.status(201).send({
  message: data.message,
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
 })
}

export default handler
