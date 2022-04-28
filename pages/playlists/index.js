import Head from 'next/head'
import { useRef, useEffect } from 'react'

import styles from '../../styles/Playlists/Playlists.module.scss'
import { getInputData } from '../../components/utils/utils'
import usePlaylists, {
    PLAYLISTS_ACTIONS,
} from '../../components/hooks/usePlaylists'
import { server } from '../../config'
import Playlist from '../../components/playlists/playlist'

export async function getServerSideProps(context) {
    const res = await fetch(`${server}/api/playlists`, {
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

export default function Playlists({ data, presence }) {
    const newNameRef = useRef()
    const userId = data.userInfo.userId

    const newPlaylistsComponents = data.allPlaylists.map((item, idx) => {
        const { name, createdAt, _id } = item
        return (
            <Playlist
                key={_id}
                _id={_id}
                name={name}
                createdAt={createdAt}
                userId={userId}
                presence={presence}
            />
        )
    })
    const { playlistsState, playlistsDispatcher } = usePlaylists(
        userId,
        presence
    )

    useEffect(() => {
        if (playlistsState.highlightName) {
            newNameRef.current.focus()
        }
    }, [playlistsState.highlightName])

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
            <section className={styles['playlists--section']}>
                <main className={styles['playlists--container']}>
                    <h1 className={styles['title']}>
                        Hi{' '}
                        <span className={styles['user-name']}>
                            {data.userInfo.name}
                        </span>
                    </h1>
                    {data.allPlaylists.length === 0 ? (
                        <p className={styles['no-playlists']}>
                            You currently have no playlists
                        </p>
                    ) : (
                        <>
                            <p className={styles['your-playlists--cap']}>
                                Your playlists:
                            </p>
                            <div
                                className={styles['playlists-comp--container']}
                            >
                                {newPlaylistsComponents}
                            </div>
                        </>
                    )}
                    {playlistsState.operationServerError && (
                        <p className={styles['add-server-error']}>
                            Error 500: <br /> Server Error while trying to
                            perform the operation, please try again.
                        </p>
                    )}
                    {playlistsState.displayForm ? (
                        <form className={styles['add-form']}>
                            {playlistsState.duplicated && (
                                <p className={styles['already-exists']}>
                                    Playlist '{playlistsState.newName}' already
                                    exists
                                </p>
                            )}
                            <label htmlFor="newName">Name:</label>
                            <input
                                name="newName"
                                type="text"
                                value={playlistsState.newName}
                                id="newName"
                                ref={newNameRef}
                                required
                                className={`${styles['name']} ${
                                    playlistsState.highlightName &&
                                    styles['highlight-name']
                                }`}
                                onChange={e =>
                                    playlistsDispatcher({
                                        type: PLAYLISTS_ACTIONS.HANDLE_FORM,
                                        payload: getInputData(e),
                                    })
                                }
                            />
                            <button
                                className={styles['cancel--btn']}
                                onClick={e => {
                                    e.preventDefault()
                                    playlistsDispatcher({
                                        type: PLAYLISTS_ACTIONS.TOGGLE_FORM,
                                        display: false,
                                    })
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles['add--btn']}
                                onClick={e => {
                                    e.preventDefault()
                                    playlistsDispatcher({
                                        type: PLAYLISTS_ACTIONS.SEND_ADD,
                                    })
                                }}
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <button
                            className={styles['create--btn']}
                            onClick={e => {
                                playlistsDispatcher({
                                    type: PLAYLISTS_ACTIONS.TOGGLE_FORM,
                                    display: true,
                                })
                            }}
                        >
                            Create playlist
                        </button>
                    )}
                </main>
            </section>
        </>
    )
}
