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
            <div className={styles['playlists--processing']}>Processing...</div>
        )
    }

    return (
        <section className={styles['playlists--section']}>
            <main className={styles['playlists--container']}>
                <h1 className={styles['title']}>
                    Hi {playlistsState.allData.userInfo.name}!
                </h1>
                {!playlistsState.allData.allPlaylists.length ? (
                    <p className={styles['no-playlists']}>
                        You currently have no playlists
                    </p>
                ) : (
                    <>
                        <p>Your playlists:</p>
                        <div className={styles['playlists-comp--container']}>
                            {playlistsState.playlistsComponents}
                        </div>
                    </>
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
