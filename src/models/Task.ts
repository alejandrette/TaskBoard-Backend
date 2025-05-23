import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_PREVIEW: 'underReview',
  COMPLETED: 'completed'
} as const 

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export type TaskType = Document & {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[]
  notes: Types.ObjectId[];
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
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },
  completedBy: [
    {
      user: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
      },
      status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
      }
    }
  ],
  notes: [{
    type: Types.ObjectId,
    ref: 'Note'
  }]
}, {timestamps: true})

const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task