import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from '../../styles/Layout/Header.module.scss'
import { useState, useEffect } from 'react'
import Navbar from './navbar'

export default function Header() {
    const router = useRouter()
    const [navOn, setNavOn] = useState(false)
    const [inPlaylists, setInPlaylists] = useState(false)

    const toggleNav = () => {
        if (window.innerWidth < 900) {
            setNavOn(prev => !prev)
            return
        }
        setNavOn(false)
    }

    useEffect(() => {
        const pathnameArr = window.location.pathname.split('/')
        if (pathnameArr.some(path => path === 'playlists')) {
            setInPlaylists(true)
            return
        }
        setInPlaylists(false)
    }, [router])

    useEffect(() => {
        if (navOn) {
            document.body.style.overflow = 'hidden'
            return
        }
        document.body.style.overflow = 'initial'
    }, [navOn])

    return (
        <header className={styles['header']} id="header">
            <Link href={inPlaylists ? '/playlists' : '/'}>
                <a className={styles['logo--link']}>
                    <Image
                        src="/logos/mockify-logo.svg"
                        alt=""
                        width={180}
                        height={50}
                        className={styles['logo']}
                    />
                    <span className={styles['assistive-text']}>
                        Website Icon. Go to home page
                    </span>
                </a>
            </Link>
            <button
                className={styles['toggle-nav']}
                aria-label="toggle navigation"
                onClick={toggleNav}
            >
                <span
                    className={`${styles['hamburger']} ${
                        navOn && styles['hamburger-clicked']
                    }`}
                ></span>
            </button>
            <Navbar navOn={navOn} toggleNav={toggleNav} />
        </header>
    )
}
