import * as mongoose from 'mongoose'

export interface IUser {
    id: Number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    id: { type: Number },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    password: { type: String }
});
  
export const User = mongoose.model<IUser>('User', userSchema);