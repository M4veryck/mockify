import dbConnect from '../../../lib/connect'
import jwt from 'jsonwebtoken'
import Playlist from '../../../models/Playlist'

export default async function playlists(req, res) {
    try {
        await dbConnect()

        const { userInfo } = authMiddleware(req)

        if (!userInfo) {
            return res
                .status(403)
                .json({ error: 'You are not allowed to access this resource' })
        }

        if (req.method === 'GET') {
            const allPlaylists = await Playlist.find({
                createdBy: userInfo.userId,
            })
            return res.status(200).json({ allPlaylists, userInfo })
        }

        if (req.method === 'POST') {
            const newPlaylist = await Playlist.create({
                name: req.body.name,
                createdBy: req.body.userId,
            })
            return res.status(200).json({ newPlaylist })
        }

        if (req.method === 'DELETE') {
            await Playlist.findOneAndDelete({
                name: req.query.name,
            })
            return res.status(200).json({ success: true })
        }

        return res.status(400).json({ error: 'Invalid method' })
    } catch (err) {
        console.log(err.message)
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ error_code: err.code, error: 'Duplicated field' })
        }
        return res.status(500).json({
            server_error: err.message,
            code: err.code,
        })
    }
}

function authMiddleware(req) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return false
    }

    const token = authHeader.split(' ')[1]

    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)
        return { userInfo }
    } catch {
        return false
    }
}