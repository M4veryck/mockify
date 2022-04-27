import Link from 'next/link'

import styles from '../../styles/Playlists/Playlists.module.scss'
import usePlaylists, { PLAYLISTS_ACTIONS } from '../hooks/usePlaylists'
// import { PlaylistsContextConsumer } from '../playlistsContext'

export default function Playlist({ _id, name, createdAt, initialState }) {
    const { playlistsDispatcher } = usePlaylists(initialState)

    let formatedDate = ''
    const dateArr = createdAt.split('-')
    formatedDate += dateArr[1]
    formatedDate += '/'
    formatedDate += dateArr[2].slice(0, 2)
    formatedDate += '/'
    formatedDate += dateArr[0]

    return (
        <div className={styles['playlist']}>
            <h2 className={styles['playlist--title']} title={name}>
                {name}
            </h2>
            <p className={styles['playlist--date']}>{formatedDate}</p>

            <Link href={`/playlists/${_id}`}>
                <a className={styles['edit--btn']}>Edit</a>
            </Link>

            <button
                className={styles['delete--btn']}
                onClick={e => {
                    playlistsDispatcher({
                        type: PLAYLISTS_ACTIONS.SEND_DELETE,
                        _id,
                    })
                }}
            >
                Delete
            </button>
        </div>
    )
}
