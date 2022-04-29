import Link from 'next/link'

import styles from '../../styles/Playlists/Playlists.module.scss'
import usePlaylists, { PLAYLISTS_ACTIONS } from '../hooks/usePlaylists'

export default function Playlist({ _id, name, createdAt, userId, presence }) {
    const localDate = new Date(createdAt)
    const { playlistsDispatcher } = usePlaylists(userId, presence)

    const year = localDate.getFullYear()
    const month = localDate.getMonth() + 1
    const day = localDate.getDate()
    const formatedDate = month + '/' + day + '/' + year

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
