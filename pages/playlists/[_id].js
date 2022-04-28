import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'

import styles from '../../styles/Playlists/Playlists.module.scss'
import { getInputData } from '../../components/utils/utils'
import { server } from '../../config'
import useOnePlaylist, {
    ONE_PLAYLIST_ACTIONS,
} from '../../components/hooks/useOnePlaylist'

export async function getServerSideProps(context) {
    const res = await fetch(`${server}/api/playlists/${context.query._id}`, {
        method: 'GET',
        headers: {
            cookies: JSON.stringify({ presence: context.req.cookies.presence }),
            'Content-Type': 'application/json',
        },
    })

    if (res.status === 403) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    const data = await res.json()

    if (res.ok) {
        return {
            props: {
                data,
                presence: context.req.cookies.presence,
            },
        }
    }

    return {
        redirect: {
            destination: '/500',
            permanent: false,
        },
    }
}

export default function PlaylistToEdit({ data, presence }) {
    const newNameRef = useRef()
    const prevName = data.singlePlaylist.name
    const [onePlaylistState, onePlaylistDispatcher] = useOnePlaylist(
        data.singlePlaylist._id,
        presence
    )

    useEffect(() => {
        if (onePlaylistState.highlightNewName) {
            newNameRef.current.focus()
        }
    }, [onePlaylistState.highlightNewName])

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
                        <p
                            className={
                                styles['single-playlist--already-exists']
                            }
                        >
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
