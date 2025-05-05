import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          {manager: {$in: req.user.id}}
        ]
      })
      res.send({ data: projects })
    } catch (error) {
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

      if(projects.manager.toString() !== req.user.id){
        res.status(404).json({ errors: 'Project dont found' })
        return
      }

      res.send({ data: projects })
    } catch (error) {
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body)
    // Asiganr un manager
    project.manager = req.user.id

    try {
      await project.save()
      res.send('Project created successfull')
    } catch (error) {
      res.status(500).json({ errors: 'Error posting projects' })
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const projects = await Project.findByIdAndUpdate(id, req.body, { new: true })
      if(!projects){
        res.status(404).json({ errors: 'Project dont found' })
        return
      }

      if(projects.manager.toString() !== req.user.id){
        res.status(404).json({ errors: 'Only the manager can update' })
        return
      }

      res.json({ message: "Project update successfully" });
    } catch (error) {
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

      if(projects.manager.toString() !== req.user.id){
        res.status(404).json({ errors: 'Only the manager can delete' })
        return
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ errors: 'Error geting projects' })
    }
  }
}