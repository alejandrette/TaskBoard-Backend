import { Request, Response, NextFunction } from "express";
import Task, { TaskType } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: TaskType
    }
  }
}

export async function validateTaskExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params
    const task = await Task.findById(taskId)
    
    if(!task){
      res.status(404).json({ errors: 'Task dont found' })
      return
    }
    req.task = task
    next()
  } catch (error) {
    res.status(500).json({ errors: 'Error' })
  }
}