import express from 'express'
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import projectRoutes from './routes/ProjectRoutes'

dotenv.config()
connectDB()

const app = express()

//Router
app.use('/api/projects', projectRoutes)

export default app