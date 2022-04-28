import { useRouter } from 'next/router'
import { useState, useEffect, useReducer } from 'react'

import { updatePlaylist } from '../playlists/CRUD'

export const ONE_PLAYLIST_ACTIONS = {
    HANDLE_UPDATE_FORM: 'handle-update-form',
    SEND_UPDATE: 'send-update',
    UPDATE_SUCCESS: 'update-success',
    UPDATE_DUPLICATED: 'update-duplicated',
    SERVER_ERROR: 'server-error',
}

const initialState = {
    newName: '',
    highlightNewName: false,
    nameDuplicated: false,
    serverError: false,
}

export default function useOnePlaylist(playlistId, presence) {
    const router = useRouter()
    const [fetchUpdate, setFetchUpdate] = useState(false)
    const [onePlaylistState, onePlaylistDispatcher] = useReducer(
        onePlaylistReducer,
        initialState
    )

    function onePlaylistReducer(onePlaylistState, action) {
        switch (action.type) {
            case ONE_PLAYLIST_ACTIONS.HANDLE_UPDATE_FORM:
                return {
                    ...onePlaylistState,
                    newName: action.payload.value,
                    highlightNewName: false,
                    nameDuplicated: false,
                }

            case ONE_PLAYLIST_ACTIONS.SEND_UPDATE:
                if (!onePlaylistState.newName) {
                    return {
                        ...onePlaylistState,
                        highlightNewName: true,
                    }
                }

                setFetchUpdate(true)

                return onePlaylistState

            case ONE_PLAYLIST_ACTIONS.UPDATE_SUCCESS:
                router.push('/playlists')
                return initialState

            case ONE_PLAYLIST_ACTIONS.UPDATE_DUPLICATED:
                return {
                    ...onePlaylistState,
                    nameDuplicated: true,
                }

            case ONE_PLAYLIST_ACTIONS.SERVER_ERROR:
                router.push('/500')
                return initialState

            default:
                throw new Error(`'${action.type}' is not a valid action`)
        }
    }

    useEffect(() => {
        if (fetchUpdate) {
            setFetchUpdate(false)
            updatePlaylist(
                playlistId,
                onePlaylistState.newName,
                onePlaylistDispatcher,
                presence
            )
        }
    }, [fetchUpdate])

    return [onePlaylistState, onePlaylistDispatcher]
}
