import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    res.send('All projects')
  }

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body)
    try {
      await project.save()
      res.send('Project created successfull')
    } catch (error) {
      console.error(error)
    }
  }
}