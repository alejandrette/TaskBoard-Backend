import { type Request, type Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";

export class AuthController {
  static getAllUsers = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static createUser = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body

      const user = new User(req.body)
      const userExist = await User.findOne({email})

      if (userExist){
        res.status(409).json({ errors: 'The user already exists' })
      }

      user.password = await hashPassword(password)

      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      await Promise.allSettled([user.save(), token.save()])

      res.send('User created successfull, check your email to confirm')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }
}