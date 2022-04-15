import { useRouter } from 'next/router'

import { useState, useEffect, useReducer } from 'react'
import { addPlaylist, deletePlaylist, getAllData } from '../playlists/CRUD'
import Playlist from '../playlists/playlist'

const initialState = {
    allData: null,
    firstPlaylistsRender: true,
    redirectToLogin: false,
    playlistsComponents: null,
    newName: '',
    displayForm: false,
    highlightName: false,
    duplicated: false,
    refreshData: false,
    idToDelete: '',
    redirectToPlaylists: false,
}

export const PLAYLISTS_ACTIONS = {
    TOGGLE_FORM: 'toggle-form',
    HANDLE_FORM: 'handle-form',
    SEND_ADD: 'send-add',
    ADD_SUCCESS: 'add-success',
    DUPLICATED: 'duplicated',
    SEND_DELETE: 'send-delete',
    DELETE_SUCCESS: 'delete-success',
    REFRESH_ALL_DATA: 'refresh-all-data',
    REDIRECT_TO_LOGIN: 'redirect-to-login',
    UPDATE_SUCCESS: 'update-success',
    STOP_REDIRECT: 'stop-redirect',
}

export default function usePlaylists(_id = '') {
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
                return {
                    ...playlistsState,
                    newName: '',
                    displayForm: false,
                    refreshData: true,
                }

            case PLAYLISTS_ACTIONS.DUPLICATED:
                return {
                    ...playlistsState,
                    duplicated: true,
                    refreshData: true,
                }

            case PLAYLISTS_ACTIONS.SEND_DELETE:
                setFetchDelete(true)
                return {
                    ...playlistsState,
                    idToDelete: action._id,
                }

            case PLAYLISTS_ACTIONS.DELETE_SUCCESS:
                return {
                    ...playlistsState,
                    refreshData: true,
                }

            case PLAYLISTS_ACTIONS.REFRESH_ALL_DATA:
                const newData = action.payload
                const newPlaylistsComponents = newData.allPlaylists.map(
                    (item, idx) => {
                        const { name, createdAt, _id } = item
                        return (
                            <Playlist
                                key={_id}
                                _id={_id}
                                name={name}
                                createdAt={createdAt}
                            />
                        )
                    }
                )

                return {
                    ...playlistsState,
                    firstPlaylistsRender: false,
                    allData: newData,
                    refreshData: false,
                    redirectToLogin: false,
                    playlistsComponents: newPlaylistsComponents,
                }

            case PLAYLISTS_ACTIONS.REDIRECT_TO_LOGIN:
                return {
                    ...playlistsState,
                    redirectToLogin: true,
                }

            case PLAYLISTS_ACTIONS.UPDATE_SUCCESS:
                return {
                    ...playlistsState,
                    refreshData: true,
                    redirectToPlaylists: true,
                }

            case PLAYLISTS_ACTIONS.STOP_REDIRECT:
                return {
                    ...playlistsState,
                    redirectToPlaylists: false,
                }

            default:
                return playlistsState
        }
    }

    useEffect(() => {
        if (fetchAdd) {
            setFetchAdd(false)
            addPlaylist(playlistsState, playlistsDispatcher)
        }
    }, [fetchAdd])

    useEffect(() => {
        if (fetchDelete) {
            setFetchDelete(false)
            deletePlaylist(playlistsState, playlistsDispatcher)
        }
    }, [fetchDelete])

    useEffect(() => {
        if (playlistsState.refreshData || playlistsState.firstPlaylistsRender) {
            getAllData(playlistsDispatcher)
        }
    }, [playlistsState.refreshData])

    useEffect(() => {
        if (playlistsState.redirectToPlaylists) {
            router.push('/playlists')
            playlistsDispatcher({
                type: PLAYLISTS_ACTIONS.STOP_REDIRECT,
            })
        }
    }, [playlistsState.redirectToPlaylists])

    return {
        playlistsState,
        playlistsDispatcher,
    }
}
