import { type Request, type Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body

      const user = new User(req.body)
      const userExist = await User.findOne({email})

      if (userExist){
        res.status(409).json({ errors: 'The user already exists' })
        return
      }

      user.password = await hashPassword(password)

      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })

      await Promise.allSettled([user.save(), token.save()])

      res.send('User created successfull, check your email to confirm')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static confirmUser = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({token})

      if (!tokenExist){
        res.status(404).json({ errors: 'The token dont exist' })
        return
      }

      const user = await User.findById(tokenExist.user)
      user.confirmed = true
      
      await Promise.allSettled([
        user.save(),
        tokenExist.deleteOne()
      ])

      res.send('Account confirmed successfully')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting token' })
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({email})

      if(!user){
        res.status(404).json({ errors: 'User dont exist' })
        return
      }

      if(!user.confirmed){
        const token = new Token()
        token.user = user.id
        token.token = generateToken()
        await token.save()

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token
        })

        res.status(401).json({ errors: 'Unconfirmed account, check your email to confirm it' })
        return
      }

      const isPasswordCorrect = await checkPassword(password, user.password)
      if(!isPasswordCorrect){
        res.status(404).json({ errors: 'Incorrect password' })
        return
      }

      const token = generateJWT({id: user.id})
      res.send(token)

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting token' })
    }
  }

  static requestConfirmCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      const user = await User.findOne({email})

      if (!user){
        res.status(404).json({ errors: 'The user dont exist' })
        return
      }

      if(user.confirmed){
        res.status(403).json({ errors: 'The user is confirmed' })
        return
      }

      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })

      await Promise.allSettled([user.save(), token.save()])

      res.send('Send new code')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      const user = await User.findOne({email})

      if (!user){
        res.status(404).json({ errors: 'The user dont exist' })
        return
      }

      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      AuthEmail.sendForgotPassword({
        email: user.email,
        name: user.name,
        token: token.token
      })

      await Promise.allSettled([token.save()])

      res.send('Check your email for instructions')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static validToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body

      const tokenExist = await Token.findOne({token})

      if (!tokenExist){
        res.status(404).json({ errors: 'The token dont exist' })
        return
      }

      res.send('Valid token, define the new password')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting token' })
    }
  }

  static updatePassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params

      const tokenExist = await Token.findOne({token})

      if (!tokenExist){
        res.status(404).json({ errors: 'The token dont exist' })
        return
      }

      const user = await User.findById(tokenExist.user)
      user.password = await hashPassword(req.body.password)

      await Promise.allSettled([user.save(), tokenExist.deleteOne()])

      res.send('Password changed')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting token' })
    }
  }

  static user = async (req: Request, res: Response) => {
    res.json(req.user)
  }

  static updateProfile = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body
      const userId = req.user.id

      const userExist = await User.findOne({ email })
      if(userExist && userExist.id.toString() !== req.user.id.toString()){
        res.status(409).json({ errors: 'The email already exists' })
        return
      }

      const updateUser =  await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      )

      updateUser.save()
      res.send('Profile update')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error update' })
    }
  }

  static updateCurrentPassword = async (req: Request, res: Response) => {
    try {
      const { current_password, password } = req.body;

      const userLoged = await User.findById(req.user.id)

      const isPasswordCorrect = await checkPassword(current_password, userLoged.password)
      if(!isPasswordCorrect){
        res.status(409).json({ errors: 'The current password is incorrect' })
        return
      }

      const passwordHash = await hashPassword(password)

      const user = await User.findByIdAndUpdate(
        req.user.id, 
        { password: passwordHash }, 
        { new: true, runValidators: true }
      )

      user.save()

      res.send('Password changed')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Server error updating password' })
    }
  }
}