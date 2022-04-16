import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Layout/Header.module.scss'
import { useState, useEffect } from 'react'
import Navbar from './navbar'

export default function Header() {
    const [navOn, setNavOn] = useState(false)

    const toggleNav = () => {
        if (window.innerWidth < 900) {
            setNavOn(prev => !prev)
            return
        }
        setNavOn(false)
    }

    useEffect(() => {
        if (navOn) {
            document.body.style.overflow = 'hidden'
            return
        }
        document.body.style.overflow = 'initial'
    }, [navOn])

    return (
        <header className={styles['header']} id="header">
            <Link href="/">
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
