import { server } from '../../config'
import { ONE_PLAYLIST_ACTIONS } from '../hooks/useOnePlaylist'
import { PLAYLISTS_ACTIONS } from '../hooks/usePlaylists'

export async function addPlaylist(name, userId, presence, playlistsDispatcher) {
    try {
        const res = await fetch(`${server}/api/playlists`, {
            method: 'POST',
            headers: {
                cookies: JSON.stringify({ presence }),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                userId,
                createdAt: new Date(),
            }),
        })

        const data = await res.json()

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.ADD_SUCCESS,
            })
            return null
        }

        if (data.error_code === 11000) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DUPLICATED,
            })
            return null
        }

        throw new Error('Something went wrong')
    } catch (err) {
        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
        return null
    }
}

export async function updatePlaylist(
    playlistId,
    newName,
    onePlaylistDispatcher,
    presence
) {
    try {
        const res = await fetch(`${server}/api/playlists/${playlistId}`, {
            method: 'PATCH',
            headers: {
                cookies: JSON.stringify({
                    presence,
                }),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName }),
        })

        const data = await res.json()

        if (res.ok) {
            onePlaylistDispatcher({ type: ONE_PLAYLIST_ACTIONS.UPDATE_SUCCESS })
            return null
        }

        if (data.error_code === 11000) {
            onePlaylistDispatcher({
                type: ONE_PLAYLIST_ACTIONS.UPDATE_DUPLICATED,
            })
            return null
        }

        throw new Error('Something went wrong')
    } catch (err) {
        onePlaylistDispatcher({
            type: ONE_PLAYLIST_ACTIONS.SERVER_ERROR,
        })
        return null
    }
}

export async function deletePlaylist(
    playlistId,
    presence,
    playlistsDispatcher
) {
    try {
        const res = await fetch(`${server}/api/playlists/${playlistId}`, {
            method: 'DELETE',
            headers: {
                cookies: JSON.stringify({
                    presence,
                }),
                'Content-Type': 'application/json',
            },
        })

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DELETE_SUCCESS,
            })
            return null
        }

        throw new Error('Something went wrong')
    } catch (err) {
        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
        return null
    }
}
