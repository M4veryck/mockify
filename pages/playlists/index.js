import { useState, useEffect } from 'react'
import styles from '../../styles/Playlists/Playlists.module.scss'
import { addPlaylist, getAllPlaylists } from '../../components/playlists/utils'
import Playlist from '../../components/playlists/playlist'

export default function Playlists() {
    const [userAndPlaylists, setUserAndPlaylists] = useState(null)
    const [allPlaylists, setAllPlaylists] = useState(null)
    const [displayAdd, setDisplayAdd] = useState(false)
    const [addFormData, setAddFormData] = useState({
        name: '',
    })
    const [highlightName, setHighlightName] = useState(false)

    const handleAddForm = e => {
        const value = e.target.value
        setHighlightName(false)
        setAddFormData({ name: value })
    }

    const updateUserAndPlaylists = data => {
        setUserAndPlaylists(data)
    }

    useEffect(() => {
        getAllPlaylists(updateUserAndPlaylists)
    }, [])

    useEffect(() => {
        if (userAndPlaylists) {
            setAllPlaylists(
                userAndPlaylists.allPlaylists.map((item, idx) => {
                    const { name, createdAt, _id } = item
                    return (
                        <Playlist key={_id} name={name} createdAt={createdAt} />
                    )
                })
            )
        }
    }, [userAndPlaylists])

    console.log(userAndPlaylists)

    return (
        <section className={styles['playlists--section']}>
            {userAndPlaylists ? (
                <main className={styles['playlists--container']}>
                    <h1 className={styles['title']}>
                        Hi {userAndPlaylists.userInfo.name}!
                    </h1>
                    {!userAndPlaylists.allPlaylists.length ? (
                        <p className={styles['no-playlists']}>
                            You currently have no playlists
                        </p>
                    ) : (
                        <>
                            <p>Your playlists:</p>
                            {allPlaylists}
                        </>
                    )}
                    {displayAdd ? (
                        <form className={styles['add-form']}>
                            <label htmlFor="name">Name:</label>
                            <input
                                name="name"
                                type="text"
                                value={addFormData.name}
                                required
                                className={`${styles['name']} ${
                                    highlightName && styles['highlight-name']
                                }`}
                                onChange={e => handleAddForm(e)}
                            />
                            {/* <div className={styles['add-btns--container']}> */}
                            <button
                                className={styles['cancel--btn']}
                                onClick={e => {
                                    e.preventDefault()
                                    setDisplayAdd(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles['add--btn']}
                                onClick={e => {
                                    e.preventDefault()
                                    if (!addFormData.name.length) {
                                        setHighlightName(true)
                                        return
                                    }
                                    addPlaylist(
                                        addFormData,
                                        userAndPlaylists,
                                        updateUserAndPlaylists
                                    )
                                }}
                            >
                                Submit
                            </button>
                            {/* </div> */}
                        </form>
                    ) : (
                        <button
                            className={styles['create--btn']}
                            onClick={e => {
                                setDisplayAdd(true)
                            }}
                        >
                            Create playlist
                        </button>
                    )}
                </main>
            ) : (
                <div className={styles['playlists--processing']}></div>
            )}
        </section>
    )
}
