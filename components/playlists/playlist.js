import styles from '../../styles/Playlists/Playlists.module.scss'

export default function Playlist({ name, createdAt }) {
    let formatedDate = ''
    const dateArr = createdAt.split('-')
    formatedDate += dateArr[1]
    formatedDate += '/'
    formatedDate += dateArr[2].slice(0, 2)
    formatedDate += '/'
    formatedDate += dateArr[0]
    return (
        <div className={styles['playlist']}>
            <h2 className={styles['playlist--title']}>{name}</h2>
            <p className={styles['playlist--date']}>
                Created at: {formatedDate}
            </p>
        </div>
    )
}
