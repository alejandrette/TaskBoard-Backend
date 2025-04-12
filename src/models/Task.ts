import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskType = Document & {
  name: string;
  description: string;
  project: Types.ObjectId
}

const TaskSchema: Schema = new Schema({
  name: {
    type: String, 
    require: true,
    trim: true,
  },
  description: {
    type: String, 
    require: true,
    trim: true,
  },
  project: {
    type: Types.ObjectId,
    ref: 'Project'
  }
}, {timestamps: true})

const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task