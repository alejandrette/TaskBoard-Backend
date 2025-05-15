import { type Request, type Response } from "express";
import Note, { NoteType } from "../models/Note";
import Task from "../models/Task";

export class NoteController {
  static createNode = async(req: Request<{ taskId: string }, {}, { content: string }>, res: Response) => {
    try {

      const { content } = req.body
      const { taskId } = req.params
      const userId = req.user.id

      const note = new Note({
        content,
        createBy: userId,
        task: taskId
      })
      
      const task = await Task.findById(taskId)
      if (!task) {
        res.status(404).json({ error: "Task not found" })
        return
      }

      task.notes.push(note.id)

      await Promise.allSettled([note.save(), task.save()])

      res.json({ message: "Note create successful" })

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }
}