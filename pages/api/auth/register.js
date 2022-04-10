import dbConnect from '../../../lib/connect'
import User from '../../../models/User'
import { createToken } from './login'

export default async function register(req, res) {
    try {
        await dbConnect()

        if (req.method !== 'POST') {
            return res.status(400).json({
                error: `${req.method} not allowed. Only POST allowed`,
            })
        }

        const { email } = req.body

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                alreadyRegistered: true,
                error: `User with email ${email} already registered`,
            })
        }

        const newUser = await User.create(req.body)

        const token = createToken(newUser)

        return res.status(200).json({
            name: newUser.name,
            email: newUser.email,
            token,
        })
    } catch (err) {
        return res.status(500).json({
            server_error: err.message,
        })
    }
}
