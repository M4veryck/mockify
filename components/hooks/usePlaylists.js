import { useRouter } from 'next/router'

import { useState, useEffect, useReducer } from 'react'
import { addPlaylist, deletePlaylist } from '../playlists/CRUD'

export const PLAYLISTS_ACTIONS = {
    TOGGLE_FORM: 'toggle-form',
    HANDLE_FORM: 'handle-form',
    SEND_ADD: 'send-add',
    ADD_SUCCESS: 'add-success',
    DUPLICATED: 'duplicated',
    SEND_DELETE: 'send-delete',
    DELETE_SUCCESS: 'delete-success',
    OP_SERVER_ERROR: 'op-server-error',
}

const initialState = {
    newName: '',
    displayForm: false,
    highlightName: false,
    duplicated: false,
    idToDelete: '',
    serverError: false,
    operationServerError: false,
}

export default function usePlaylists(userId, presence) {
    const router = useRouter()
    const [fetchAdd, setFetchAdd] = useState(false)
    const [fetchDelete, setFetchDelete] = useState(false)

    const [playlistsState, playlistsDispatcher] = useReducer(
        playlistsReducer,
        initialState
    )

    function playlistsReducer(playlistsState, action) {
        switch (action.type) {
            case PLAYLISTS_ACTIONS.TOGGLE_FORM:
                return {
                    ...playlistsState,
                    displayForm: action.display,
                }

            case PLAYLISTS_ACTIONS.HANDLE_FORM:
                const { name, value } = action.payload
                return {
                    ...playlistsState,
                    [name]: value,
                    highlightName: false,
                    duplicated: false,
                    operationServerError: false,
                }

            case PLAYLISTS_ACTIONS.SEND_ADD:
                if (!playlistsState.newName) {
                    return {
                        ...playlistsState,
                        highlightName: true,
                    }
                }

                setFetchAdd(true)

                return playlistsState

            case PLAYLISTS_ACTIONS.ADD_SUCCESS:
                router.push('/playlists', '/playlists', { shallow: false })
                return {
                    ...playlistsState,
                    newName: '',
                    displayForm: false,
                }

            case PLAYLISTS_ACTIONS.DUPLICATED:
                return {
                    ...playlistsState,
                    duplicated: true,
                }

            case PLAYLISTS_ACTIONS.SEND_DELETE:
                setFetchDelete(true)
                return {
                    ...playlistsState,
                    idToDelete: action._id,
                }

            case PLAYLISTS_ACTIONS.DELETE_SUCCESS:
                router.push('/playlists', '/playlists', { shallow: false })
                return playlistsState

            case PLAYLISTS_ACTIONS.OP_SERVER_ERROR:
                return {
                    ...playlistsState,
                    operationServerError: true,
                }

            default:
                throw new Error(`'${action.type}' is not a valid action`)
        }
    }

    useEffect(() => {
        if (fetchAdd) {
            setFetchAdd(false)
            addPlaylist(
                playlistsState.newName,
                userId,
                presence,
                playlistsDispatcher
            )
        }
    }, [fetchAdd])

    useEffect(() => {
        if (fetchDelete) {
            setFetchDelete(false)
            deletePlaylist(
                playlistsState.idToDelete,
                presence,
                playlistsDispatcher
            )
        }
    }, [fetchDelete])

    return {
        playlistsState,
        playlistsDispatcher,
    }
}
