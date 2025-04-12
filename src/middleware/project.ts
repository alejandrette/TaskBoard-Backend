import { Request, Response, NextFunction } from "express";
import Project, { ProjectType } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: ProjectType
    }
  }
}

export async function validateProjectExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)
    
    if(!project){
      res.status(404).json({ errors: 'Project dont found' })
      return
    }
    req.project = project
    next()
  } catch (error) {
    res.status(500).json({ errors: 'Error' })
  }
}