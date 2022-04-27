import { server } from '../../config'
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

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.REFRESH_ALL_DATA,
                payload: data,
            })
            return true
        }

        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.SERVER_ERROR,
        })
    } catch (err) {
        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.SERVER_ERROR,
        })
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
            return true
        }

        onePlaylistDispatcher({
            type: ONE_PLAYLIST_ACTIONS.SERVER_ERROR,
        })
    } catch (err) {
        onePlaylistDispatcher({
            type: ONE_PLAYLIST_ACTIONS.SERVER_ERROR,
        })
    }
}

export async function addPlaylist(playlistsState, playlistsDispatcher) {
    try {
        const res = await fetch(`${server}/api/playlists`, {
            method: 'POST',
            headers: {
                cookies: JSON.stringify({ presence: playlistsState.presence }),
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
            return null
        }

        if (data.error_code === 11000) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DUPLICATED,
            })
            return null
        }

        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
    } catch (err) {
        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
    } finally {
        return null
    }
}

export async function updatePlaylist(
    playlistId,
    newName,
    onePlaylistDispatcher,
    presence
    // playlistsDispatcher
) {
    try {
        // const userToken = localStorage.getItem('userToken')
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
        // const res = await fetch(`/api/playlists/${_id}`, {
        //     method: 'PATCH',
        //     headers: {
        //         Authorization: `Bearer ${userToken}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ newName }),
        // })

        const data = await res.json()

        if (res.ok) {
            onePlaylistDispatcher({ type: ONE_PLAYLIST_ACTIONS.UPDATE_SUCCESS })
            return
        }

        if (data.error_code === 11000) {
            onePlaylistDispatcher({
                type: ONE_PLAYLIST_ACTIONS.UPDATE_DUPLICATED,
            })
            return
        }

        // playlistsDispatcher({ type: PLAYLISTS_ACTIONS.UPDATE_ERROR })
    } catch (err) {
        console.log(err)
        // playlistsDispatcher({ type: PLAYLISTS_ACTIONS.UPDATE_ERROR })
    } finally {
        return null
    }
}

export async function deletePlaylist(playlistsState, playlistsDispatcher) {
    try {
        // console.log(playlistsState.presence)
        const res = await fetch(
            `${server}/api/playlists/${playlistsState.idToDelete}`,
            {
                method: 'DELETE',
                headers: {
                    cookies: JSON.stringify({
                        presence: playlistsState.presence,
                    }),
                    'Content-Type': 'application/json',
                },
            }
        )

        if (res.ok) {
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.DELETE_SUCCESS,
            })
            return null
        }

        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
    } catch (err) {
        playlistsDispatcher({
            type: PLAYLISTS_ACTIONS.OP_SERVER_ERROR,
        })
    } finally {
        return null
    }
}
