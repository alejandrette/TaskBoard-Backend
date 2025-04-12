import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { TaskType } from "./Task";

export type ProjectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<TaskType & Document>[]
}

const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String, 
    require: true,
    trim: true,
  },
  clientName: {
    type: String, 
    require: true,
    trim: true,
  },
  description: {
    type: String, 
    require: true,
    trim: true,
  },
  tasks: [{
    type: Types.ObjectId,
    ref: 'Task'
  }]
}, {timestamps: true})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project