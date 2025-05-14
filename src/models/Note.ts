import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";

export type NoteType = Document & {
  content: string;
  createBy: Types.ObjectId;
  task: Types.ObjectId;
}

const NoteSchema: Schema = new Schema({
  content: {
    type: String, 
    require: true,
  },
  createBy: {
    type: Types.ObjectId,
    ref: 'User',
    require: true,
  },
  task: {
    type: Types.ObjectId,
    ref: 'Task',
    require: true,
  },
}, {timestamps: true})

const Note = mongoose.model<NoteType>('Note', NoteSchema)
export default Note