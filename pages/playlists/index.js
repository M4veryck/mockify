import Head from 'next/head'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/Playlists/Playlists.module.scss'
import { getInputData } from '../../components/utils/utils'
import usePlaylists, {
    PLAYLISTS_ACTIONS,
} from '../../components/hooks/usePlaylists'
import { PlaylistsContextConsumer } from '../../components/playlistsContext'
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
            destination: '/',
            permanent: false,
        },
    }
}

export default function Playlists({ data, presence }) {
    const initialState = {
        allData: data,
        presence,
        // firstPlaylistsRender: true,
        redirectToLogin: false,
        playlistsComponents: null,
        newName: '',
        displayForm: false,
        highlightName: false,
        duplicated: false,
        // refreshData: false,
        idToDelete: '',
        // redirectToPlaylists: false,
        serverError: false,
        operationServerError: false,
    }

    const newPlaylistsComponents = data.allPlaylists.map((item, idx) => {
        const { name, createdAt, _id } = item
        return (
            <Playlist
                key={_id}
                _id={_id}
                name={name}
                createdAt={createdAt}
                initialState={initialState}
            />
        )
    })
    // console.log(data)
    const { playlistsState, playlistsDispatcher } = usePlaylists(initialState)
    const router = useRouter()
    const newNameRef = useRef()

    // if (playlistsState.redirectToLogin) {
    //     router.push('/login')
    // }

    // if (playlistsState.redirectToPlaylist) {
    //     router.push(`/playlists/${playlistsState.nameToGet}`)
    // }

    // if (playlistsState.serverError) {
    //     return (
    //         <>
    //             <Head>
    //                 <title>Server Error - Mockify</title>
    //                 <meta
    //                     name="description"
    //                     content="Add, edit and delete custom playlists"
    //                 />
    //                 <link rel="icon" href="/favicon.ico" />
    //             </Head>
    //             <div className={styles['server-error']}>
    //                 <h1 className={styles['sad-face']}>:(</h1>
    //                 <p className={styles['server-error--message']}>
    //                     500 Error <br /> <br />
    //                     My server ran into a problem (sorry for the
    //                     inconviniences), please try again later.
    //                 </p>
    //             </div>
    //         </>
    //     )
    // }

    // if (!playlistsState.allData) {
    //     return (
    //         <>
    //             <Head>
    //                 <title>Playlists - Mockify</title>
    //                 <meta
    //                     name="description"
    //                     content="Add, edit and delete custom playlists"
    //                 />
    //                 <link rel="icon" href="/favicon.ico" />
    //             </Head>
    //             <div className={styles['playlists--processing']}>
    //                 <h1 className={styles['processing']}>Processing...</h1>
    //             </div>
    //         </>
    //     )
    // }

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
                            {playlistsState.allData.userInfo.name}
                        </span>
                    </h1>
                    {!playlistsState.allData.allPlaylists.length ? (
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
                                    Playlist '{playlistsState.name}' already
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
