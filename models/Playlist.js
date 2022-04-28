import mongoose from 'mongoose'

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name missing'],
        unique: true,
        // index: true,
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

PlaylistSchema.index({ name: 1 })

export default mongoose.models.Playlist ||
    mongoose.model('Playlist', PlaylistSchema)
