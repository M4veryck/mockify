import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { emailRegex } from '../components/utils/utils'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name missing'],
    },
    email: {
        type: String,
        required: [true, 'email missing'],
        match: [emailRegex, 'invalid email'],
    },
    password: {
        type: String,
        required: [true, 'password missing'],
        minlength: [6, 'Your password must be at least 6 characters long'],
    },
})

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12))
    next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
