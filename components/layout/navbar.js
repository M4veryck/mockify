import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '../../styles/Layout/Navbar.module.scss'
import { PlaylistsContextConsumer } from '../playlistsContext'

export default function Navbar({ navOn, toggleNav }) {
    const { logOff } = PlaylistsContextConsumer()
    const router = useRouter()
    const [inPlaylists, setInPlaylists] = useState(false)

    useEffect(() => {
        const pathnameArr = window.location.pathname.split('/')
        if (pathnameArr.some(path => path === 'playlists')) {
            setInPlaylists(true)
            return
        }
        setInPlaylists(false)
    }, [router])

    return (
        <nav className={`${styles['nav']} ${navOn && styles['nav-open']}`}>
            <ul className={styles['nav-list']}>
                {inPlaylists ? (
                    <li>
                        <button
                            className={`${styles['nav-link']} ${styles['log-out']}`}
                            onClick={e => {
                                logOff()
                            }}
                        >
                            Log out
                        </button>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link href="/register">
                                <a
                                    className={styles['nav-link']}
                                    onClick={toggleNav}
                                >
                                    Register
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/login">
                                <a
                                    className={styles['nav-link']}
                                    onClick={toggleNav}
                                >
                                    Log in
                                </a>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
