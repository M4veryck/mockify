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

        const { _id } = req.query

        if (req.method === 'GET') {
            const singlePlaylist = await Playlist.findById(_id)
            return res.status(200).json({ singlePlaylist })
        }

        if (req.method === 'PATCH') {
            const updatedPlaylist = await Playlist.findByIdAndUpdate(
                _id,
                { name: req.body.newName },
                { new: true, runValidators: true, overwrite: false }
            )
            return res.status(200).json({ updatedPlaylist })
        }

        if (req.method === 'DELETE') {
            await Playlist.findByIdAndDelete(_id)
            return res.status(200).json({ success: true })
        }

        return res.status(400).json({ error: 'Invalid method' })
    } catch (err) {
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
