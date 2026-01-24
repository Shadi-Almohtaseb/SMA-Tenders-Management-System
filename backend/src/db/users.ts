import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    authentication: {
        password: { type: String, required: true, selected: false },
        salt: { type: String, selected: false },
        sessionToken: { type: String, selected: false }
    },
    createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model('User', userSchema);

export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken })
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = (userData: any) => new UserModel(userData).save().then(user => user.toObject())
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id)
export const updateUserById = (id: string, updateData: any) => UserModel.findByIdAndUpdate(id, updateData, { new: true })