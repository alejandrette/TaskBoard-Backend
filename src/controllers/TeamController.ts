import { type Request, type Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      const user = await User.findOne({email}).select('id name email')

      if(!user){
        res.status(404).json({ errors: 'User dont found' })
        return
      }

      res.json(user)

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static addMember = async (req: Request, res: Response) => {
    try {
      const { id } = req.body

      const userExist = await User.findById(id)

      if(!userExist){
        res.status(404).json({ errors: 'User dont found' })
        return
      }

      if(req.project.team.some(team => team.toString() === userExist.id.toString())){
        res.status(409).json({ errors: 'The user already exists in the project' })
        return
      }

      req.project.team.push(userExist.id)
      await req.project.save()

      res.json({ message: "User add successful" })

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static deleteMember = async (req: Request, res: Response) => {
    try {
      const { id } = req.body

      if(!req.project.team.some(team => team.toString() === id.toString())){
        res.status(404).json({ errors: 'User dont found' })
        return
      }

      req.project.team = req.project.team.filter(team => team.toString() !== id.toString())
      await req.project.save()

      res.json({ message: "User remove successful" })

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static getMembers = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.project.id).populate({
        path: 'team',
        select: 'id name email'
      })

      res.json(project.team)

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }
}