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
        <header className={styles.header}>
            <Link href="/#main">
                <a className={styles.logoLink}>
                    <Image
                        src="/MMaveryck.svg"
                        alt=""
                        width={250}
                        height={50}
                        className={styles.logo}
                    />
                </a>
            </Link>
            <button
                className={styles.navToggle}
                aria-label="toggle navigation"
                onClick={toggleNav}
            >
                <span
                    className={`${styles.hamburger} ${
                        navOn && styles.hamburgerClicked
                    }`}
                ></span>
            </button>
            <Navbar navOn={navOn} toggleNav={toggleNav} />
        </header>
    )
}
