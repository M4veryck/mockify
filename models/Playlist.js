import mongoose from 'mongoose'

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name missing'],
        unique: true,
        // dropDups: true,
    },
    createdBy: {
        // type: mongoose.Types.ObjectId,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
    createdAt: {
        type: Date,
        default: Date(),
    },
})

export default mongoose.models.Playlist ||
    mongoose.model('Playlist', PlaylistSchema)
