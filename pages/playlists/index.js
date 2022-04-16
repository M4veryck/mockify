import { useRouter } from 'next/router'

import styles from '../../styles/Playlists/Playlists.module.scss'
import { getInputData } from '../../components/utils/utils'
import { PLAYLISTS_ACTIONS } from '../../components/hooks/usePlaylists'
import { PlaylistsContextConsumer } from '../../components/playlistsContext'

export default function Playlists() {
    const { playlistsState, playlistsDispatcher } = PlaylistsContextConsumer()
    const router = useRouter()

    if (playlistsState.redirectToLogin) {
        router.push('/login')
    }

    if (playlistsState.redirectToPlaylist) {
        router.push(`/playlists/${playlistsState.nameToGet}`)
    }

    if (!playlistsState.allData) {
        return (
            <div className={styles['playlists--processing']}>
                <h1 className={styles['processing']}>Processing...</h1>
            </div>
        )
    }

    if (playlistsState.serverError) {
        return (
            <div className={styles['server-error']}>
                <h1 className={styles['sad-face']}>:(</h1>
                <p className={styles['server-error--message']}>
                    500 Error <br /> <br />
                    My server ran into a problem (sorry for the inconviniences),
                    please try again later.
                </p>
            </div>
        )
    }

    return (
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
                        <div className={styles['playlists-comp--container']}>
                            {playlistsState.playlistsComponents}
                        </div>
                    </>
                )}
                {playlistsState.operationServerError && (
                    <p className={styles['add-server-error']}>
                        Error 500: <br /> Server Error while trying to perform
                        the operation, please try again.
                    </p>
                )}
                {playlistsState.displayForm ? (
                    <form className={styles['add-form']}>
                        {playlistsState.duplicated && (
                            <p className={styles['already-exists']}>
                                Playlist '{playlistsState.name}' already exists
                            </p>
                        )}
                        <label htmlFor="newName">Name:</label>
                        <input
                            name="newName"
                            type="text"
                            value={playlistsState.newName}
                            id="newName"
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
    )
}
