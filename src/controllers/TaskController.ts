import { type Request, type Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate('project')

      res.send({ data: tasks })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id).populate({path: 'completedBy.user', select: 'id name email'})
      res.json(task)
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

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

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      req.task.name = name;
      req.task.description = description;

      await req.task.save();
      res.json({ message: "Task update successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())          
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])

      res.json({ message: "Task delete successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body
      req.task.status = status
      const data = {
        user: req.user.id,
        status
      }

      req.task.completedBy.push(data)
      await req.task.save()

      res.json({ message: "Status update successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }
}