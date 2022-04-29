import mongoose from 'mongoose'

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name missing'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
    createdAt: {
        type: Date,
        required: [true, 'date missing'],
        // default: Date(),
    },
})

export default mongoose.models.Playlist ||
    mongoose.model('Playlist', PlaylistSchema)
