import type { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    
    if(!project){
      res.status(404).json({ errors: 'Project dont found' })
      return
    }

    try {
      const task = new Task(req.body)
      task.project = project.id
      project.tasks.push(task.id)

      await task.save()
      await project.save()
      res.send('Task created succefull')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error posting projects' })
    }
  }
}