import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import { taskBelongsToProject, validateTaskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";

const router = Router()
router.use(authenticate)

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
router.param('projectId', validateProjectExist)
router.param('taskId', validateTaskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks',
  param('projectId').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('ID no valid'),
  param('taskId').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TaskController.getTaskById
)

router.post('/:projectId/tasks',
  param('projectId').isMongoId().withMessage('ID no valid'),
  body('name')
    .notEmpty().withMessage('The task name is empty'),
  body('description')
    .notEmpty().withMessage('The description is empty'),
  handleInputErrors,
  TaskController.createTask
)

router.put('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('ID no valid'),
  param('taskId').isMongoId().withMessage('ID no valid'),
  body('name')
    .notEmpty().withMessage('The task name is empty'),
  body('description')
    .notEmpty().withMessage('The description is empty'),
  handleInputErrors,
  TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('ID no valid'),
  param('taskId').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  param('projectId').isMongoId().withMessage('ID no valid'),
  param('taskId').isMongoId().withMessage('ID no valid'),
  body('status')
    .notEmpty().withMessage('The status is empty'),
  handleInputErrors,
  TaskController.updateStatus
)

// Routes Team
router.post('/:projectId/team/find',
  body('email')
    .isEmail().toLowerCase().withMessage('Email not valid'),
  handleInputErrors,
  TeamController.findMemberByEmail
)

router.post('/:projectId/team',
  body('id')
    .isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TeamController.addMember
)

router.delete('/:projectId/team',
  body('id')
    .isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TeamController.deleteMember
)

router.get('/:projectId/team',
  param('projectId').isMongoId().withMessage('ID no valid'),
  handleInputErrors,
  TeamController.getMembers
)

export default router