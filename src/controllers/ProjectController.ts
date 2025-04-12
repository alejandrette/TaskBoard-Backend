import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.send({ data: projects })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const projects = await Project.findById(id).populate('tasks')
      if(!projects){
        res.status(404).json({ errors: 'Project dont found' })
        return
      }

      res.send({ data: projects })
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body)
    try {
      await project.save()
      res.send('Project created successfull')
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error posting projects' })
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const projects = await Project.findByIdAndUpdate(id, req.body)
      if(!projects){
        res.status(404).json({ errors: 'Project dont found' })
        return
      }

      projects.save()
      res.json({ message: "Project update successfully" });
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const projects = await Project.findByIdAndDelete(id)
      if(!projects){
        res.status(404).json({ errors: 'Project dont found' })
        return
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error(error)
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }
}