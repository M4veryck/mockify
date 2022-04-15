import { ONE_PLAYLIST_ACTIONS } from '../../pages/playlists/[_id]'
import { PLAYLISTS_ACTIONS } from '../hooks/usePlaylists'

export async function getAllData(playlistsDispatcher) {
    try {
        const userToken = localStorage.getItem('userToken')

        const res = await fetch('/api/playlists', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        if (res.status === 403) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.REDIRECT_TO_LOGIN,
            })
            return null
        }

        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.REFRESH_ALL_DATA,
            payload: data,
        })

        return null
    } catch (err) {
        console.log(err)
        return null
    }
}

export async function getPlaylist(_id, onePlaylistDispatcher) {
    try {
        const userToken = localStorage.getItem('userToken')
        const res = await fetch(`/api/playlists/${_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        if (res.ok) {
            onePlaylistDispatcher({
                type: ONE_PLAYLIST_ACTIONS.GET_ONE_PLAYLIST_DATA,
                payload: data,
            })
            return null
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

export async function addPlaylist(playlistsState, playlistsDispatcher) {
    try {
        const userToken = localStorage.getItem('userToken')
        const res = await fetch('/api/playlists', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: playlistsState.newName,
                userId: playlistsState.allData.userInfo.userId,
            }),
        })

        const data = await res.json()

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.ADD_SUCCESS,
            })
        }

        if (data.error_code === 11000) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DUPLICATED,
            })
        }
    } catch (err) {
        console.log(err)
    } finally {
        return null
    }
}

export async function updatePlaylist(
    _id,
    newName,
    onePlaylistDispatcher,
    playlistsDispatcher
) {
    try {
        const userToken = localStorage.getItem('userToken')
        const res = await fetch(`/api/playlists/${_id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName }),
        })

        const data = await res.json()

        if (res.ok) {
            playlistsDispatcher({ type: PLAYLISTS_ACTIONS.UPDATE_SUCCESS })
            return
        }

        if (data.error_code === 11000) {
            onePlaylistDispatcher({
                type: ONE_PLAYLIST_ACTIONS.UPDATE_DUPLICATED,
            })
        }
    } catch (err) {
        console.log(err)
    } finally {
        return null
    }
}

export async function deletePlaylist(playlistsState, playlistsDispatcher) {
    try {
        const userToken = localStorage.getItem('userToken')
        const res = await fetch(`/api/playlists/${playlistsState.idToDelete}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DELETE_SUCCESS,
            })
        }

        if (res.status === 500) {
            console.log(data)
        }
    } catch (err) {
        console.log(err)
    } finally {
        return null
    }
}
