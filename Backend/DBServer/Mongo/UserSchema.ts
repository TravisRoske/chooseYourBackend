import * as mongoose from 'mongoose'

export interface IUser {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    password: { type: String }
});
  
export const User = mongoose.model<IUser>('User', userSchema);