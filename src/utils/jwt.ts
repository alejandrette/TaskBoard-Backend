import jwt from "jsonwebtoken"
import { Types } from "mongoose"

type UserType = {
  id: Types.ObjectId;
}

export const generateJWT = (payload: UserType) => {

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '180d' })

  return token
}