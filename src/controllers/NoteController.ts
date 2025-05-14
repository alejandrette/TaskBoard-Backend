import { type Request, type Response } from "express";
import Note from "../models/Note";

export class NoteController {
  static createNode = async(req: Request, res: Response) => {
    try {

      const { content } = req.body
      const { taskId } = req.params
      const userId = req.user.id

      const note = new Note({
        content,
        createBy: userId,
        task: taskId
      })

      note.save()

      res.json({ message: "Note create successful" })

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }
}