import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";

const router = Router()

// Rotes for Projects

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
  param('id').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  ProjectController.getProjectById
)

router.post('/',
  body('projectName')
    .notEmpty().withMessage('The project name is empty'),
  body('clientName')
    .notEmpty().withMessage('The client name is empty'),
  body('description')
    .notEmpty().withMessage('The description is empty'),
  handleInputErrors,
  ProjectController.createProject
)

router.put('/:id', 
  param('id').isMongoId().withMessage('ID no valid'),
  body('projectName')
    .notEmpty().withMessage('The project name is empty'),
  body('clientName')
    .notEmpty().withMessage('The client name is empty'),
  body('description')
    .notEmpty().withMessage('The description is empty'),
  handleInputErrors,
  ProjectController.updateProject
)

router.delete('/:id', 
  param('id').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  ProjectController.deleteProject
)

// Routes for Task

router.post('/:projectId/tasks',
  param('projectId').isMongoId().withMessage('ID no valid'),
  body('name')
    .notEmpty().withMessage('The task name is empty'),
  body('description')
    .notEmpty().withMessage('The description is empty'),
  handleInputErrors,
  validateProjectExist,
  TaskController.createTask
)

export default router