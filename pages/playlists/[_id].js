import { useState, useEffect, useReducer, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'

import styles from '../../styles/Playlists/Playlists.module.scss'
import { PlaylistsContextConsumer } from '../../components/playlistsContext'
import { getInputData } from '../../components/utils/utils'
import { getPlaylist, updatePlaylist } from '../../components/playlists/CRUD'

export const ONE_PLAYLIST_ACTIONS = {
    GET_ONE_PLAYLIST_DATA: 'get-one-playlist-data',
    HANDLE_UPDATE_FORM: 'handle-update-form',
    SEND_UPDATE: 'send-update',
    UPDATE_DUPLICATED: 'update-duplicated',
    SERVER_ERROR: 'server-error',
}

export default function PlaylistToEdit() {
    const newNameRef = useRef()
    const { playlistsDispatcher } = PlaylistsContextConsumer()
    const [queryId, setQueryId] = useState('')
    const [fetchUpdate, setFetchUpdate] = useState(false)
    const [onePlaylistState, onePlaylistDispatcher] = useReducer(
        onePlaylistReducer,
        {
            onePlaylistData: null,
            newName: '',
            highlightNewName: false,
            nameDuplicated: false,
            serverError: false,
        }
    )

    function onePlaylistReducer(onePlaylistState, action) {
        switch (action.type) {
            case ONE_PLAYLIST_ACTIONS.GET_ONE_PLAYLIST_DATA:
                return {
                    ...onePlaylistState,
                    onePlaylistData: action.payload,
                }

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

            case ONE_PLAYLIST_ACTIONS.UPDATE_DUPLICATED:
                return {
                    ...onePlaylistState,
                    nameDuplicated: true,
                }

            case ONE_PLAYLIST_ACTIONS.SERVER_ERROR:
                return {
                    ...onePlaylistState,
                    serverError: true,
                }

            default:
                return onePlaylistState
        }
    }

    useEffect(() => {
        const pathnameArr = window.location.pathname.split('/')
        const indexOfPlaylists = pathnameArr.indexOf('playlists')
        const _id = pathnameArr[indexOfPlaylists + 1]

        getPlaylist(_id, onePlaylistDispatcher)
        setQueryId(_id)
    }, [])

    useEffect(() => {
        if (fetchUpdate) {
            updatePlaylist(
                queryId,
                onePlaylistState.newName,
                onePlaylistDispatcher,
                playlistsDispatcher
            )
        }
    }, [fetchUpdate])

    useEffect(() => {
        if (onePlaylistState.highlightNewName) {
            newNameRef.current.focus()
        }
    }, [onePlaylistState.highlightNewName])

    if (onePlaylistState.serverError) {
        return (
            <>
                <Head>
                    <title>Playlists - Mockify</title>
                    <meta
                        name="description"
                        content="Add, edit and delete custom playlists"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className={styles['server-error']}>
                    <h1 className={styles['sad-face']}>:(</h1>
                    <p className={styles['server-error--message']}>
                        500 Error <br /> <br />
                        My server ran into a problem (sorry for the
                        inconviniences), please try again later.
                    </p>
                </div>
            </>
        )
    }

    if (!onePlaylistState.onePlaylistData) {
        return (
            <>
                <Head>
                    <title>Playlists - Mockify</title>
                    <meta
                        name="description"
                        content="Add, edit and delete custom playlists"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className={styles['playlists--processing']}>
                    <h1 className={styles['processing']}>Processing...</h1>
                </div>
            </>
        )
    }

    const prevName = onePlaylistState.onePlaylistData.singlePlaylist.name

    return (
        <>
            <Head>
                <title>{prevName} - Mockify</title>
                <meta
                    name="description"
                    content="Add, edit and delete custom playlists"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={styles['single-playlist--section']}>
                <div
                    className={`${styles['playlist']} ${styles['single-playlist']}`}
                >
                    {onePlaylistState.nameDuplicated && (
                        <p>
                            Playlist with name '{onePlaylistState.newName}'
                            already exists
                        </p>
                    )}

                    <h2 className={styles['single-playlist--title']}>
                        Previous name:
                    </h2>
                    <p
                        className={styles['playlist-prev-name']}
                        title={prevName}
                    >
                        {prevName}
                    </p>

                    <form className={styles['update-form']}>
                        <label htmlFor="new-name">New name:</label>

                        <input
                            name="new-name"
                            id="new-name"
                            ref={newNameRef}
                            value={onePlaylistState.newName}
                            className={`${styles['new-name']} ${
                                onePlaylistState.highlightNewName &&
                                styles['highlight-name']
                            }`}
                            onChange={e => {
                                onePlaylistDispatcher({
                                    type: ONE_PLAYLIST_ACTIONS.HANDLE_UPDATE_FORM,
                                    payload: getInputData(e),
                                })
                            }}
                        />

                        <Link href="/playlists">
                            <a className={styles['go-back--btn']}>Go back</a>
                        </Link>

                        <button
                            className={styles['update--btn']}
                            onClick={e => {
                                e.preventDefault()
                                onePlaylistDispatcher({
                                    type: ONE_PLAYLIST_ACTIONS.SEND_UPDATE,
                                })
                            }}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}
