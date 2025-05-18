import { Router } from "express"
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputErrors } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post('/create-user',
  body('email')
    .isEmail().withMessage('The email not valid'),
  body('name')
    .notEmpty().withMessage('The user name is empty'),
  body('password')
    .isLength({min: 8}).withMessage('The password is short, min 8 character'),
  body('password_confirmation')
    .custom((value, {req}) => {
      if(value !== req.body.password){
        throw new Error('The passwords are not the same')
      }
      return true
    }),
  handleInputErrors,
  AuthController.createUser
)

router.post('/confirm-user',
  body('token')
    .notEmpty().withMessage('The token is empty'),
  handleInputErrors,
  AuthController.confirmUser
)

router.post('/login',
  body('email')
    .isEmail().withMessage('The email not valid'),
  body('password')
    .notEmpty().withMessage('The password is empty'),
  handleInputErrors,
  AuthController.login
)

router.post('/request-token',
  body('email')
    .isEmail().withMessage('The email not valid'),
  handleInputErrors,
  AuthController.requestConfirmCode
)

router.post('/forgot-password',
  body('email')
    .isEmail().withMessage('The email not valid'),
  handleInputErrors,
  AuthController.forgotPassword
)

router.post('/valid-token',
  body('token')
    .notEmpty().withMessage('The token is empty'),
  handleInputErrors,
  AuthController.validToken
)

router.post('/update-password/:token',
  param('token')
    .isNumeric().withMessage('Token not valid'),
  body('password')
    .isLength({min: 8}).withMessage('The password is short, min 8 character'),
  body('password_confirmation')
    .custom((value, {req}) => {
      if(value !== req.body.password){
        throw new Error('The passwords are not the same')
      }
      return true
    }),
  handleInputErrors,
  AuthController.updatePassword
)

router.get('/user',
  authenticate,
  AuthController.user
)

router.patch('/profile',
  authenticate,
  body('name')
    .notEmpty().withMessage('The user name is empty'),
  body('email')
    .isEmail().withMessage('The email not valid'),
  handleInputErrors,
  AuthController.updateProfile
)

export default router
