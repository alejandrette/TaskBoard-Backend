import mongoose, { Schema, Document, Types } from "mongoose";

export type UserType = Document & {
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String, 
    require: true
  },
  email: {
    type: String, 
    require: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    require: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
}, {timestamps: true})

const User = mongoose.model<UserType>('User', UserSchema)
export default User