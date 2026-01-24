import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.js'

export default (router: express.Router) => {
    router.post('/auth/register', registerUser)
    router.post('/auth/login', loginUser)
}