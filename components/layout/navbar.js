import Link from 'next/link'
import styles from '../../styles/Layout/Navbar.module.scss'
import { NavBarContextConsumer } from '../navBarContext'

export default function Navbar({ navOn, toggleNav }) {
    // const { manageClicked, currentSection } = NavBarContextConsumer()

    return (
        <nav className={`${styles['nav']} ${navOn && styles['nav-open']}`}>
            <ul
                className={styles['nav-list']}
                // onClick={manageClicked}
            >
                {/* <li>
                    <Link href="/playlists">
                        <a
                            className={`${styles['nav-link']} ${
                                false === '/' && styles['current']
                            }`}
                            onClick={() => {
                                manageClicked()
                                toggleNav()
                            }}
                        >
                            My Playlists
                        </a>
                    </Link>
                </li> */}
                <li>
                    <Link href="/register">
                        <a
                            className={`${styles['nav-link']} ${
                                false === '/#projects' && styles['current']
                            }`}
                            onClick={toggleNav}
                        >
                            Register
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        <a
                            className={`${styles['nav-link']} ${
                                false === '/contact' && styles['current']
                            }`}
                            onClick={toggleNav}
                        >
                            Log in
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
