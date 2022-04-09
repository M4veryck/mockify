import dbConnect from '../../../lib/connect'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../../models/User'

const createToken = user =>
    jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    })

export default async function login(req, res) {
    await dbConnect()

    if (req.method !== 'POST') {
        return res.status(400).json({
            error: `${req.method} not allowed. Only POST allowed`,
        })
    }

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(404)
                .json({ error: `No user with email: ${email}` })
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Incorrect password' })
        }
        const token = createToken(user)
        return res
            .status(200)
            .json({ name: user.name, email: user.email, token })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
