import { type Request, type Response } from "express";
import Note from "../models/Note";
import Task from "../models/Task";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId
}

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

  static getTaskNote = async(req: Request, res: Response) => {
    try {

      const notes = await Note.find({task: req.task.id})  

      res.json(notes)

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }

  static deleteNote = async(req: Request<NoteParams>, res: Response) => {
    try {

      const { noteId } = req.params

      const note = await Note.findById(noteId)
      if(!note) {
        res.status(404).json({ error: "Note not found" })
        return
      }

      if(note.createBy.toString() !== req.user.id.toString()){
        res.status(404).json({ error: "You can't delete other people's rules" })
        return
      }

      await note.deleteOne()

      res.json({ message: "Successfully deleted note" })

    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting users' })
    }
  }
}