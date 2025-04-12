import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body)
      task.project = req.project.id
      req.project.tasks.push(task.id)

      await Promise.allSettled([task.save(), req.project.save()])
      res.send('Task created succefull')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error posting projects' })
    }
  }
}